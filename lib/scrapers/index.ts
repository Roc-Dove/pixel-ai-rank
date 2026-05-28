import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/db/prisma";
import { scrapeAicpb } from "@/lib/scrapers/aicpb";
import { scrapeAixzdMonth } from "@/lib/scrapers/aixzd-month";
import { scrapeAixzdStars } from "@/lib/scrapers/aixzd-stars";
import { scrapeXhunt } from "@/lib/scrapers/xhunt";
import { RANK_TYPE_TO_DB, TAB_CONFIG, type RawRankItem, type RankPayload, type RankRouteType, type ScrapeResult } from "@/types/rank";

const SCRAPERS: Array<{
  routeType: RankRouteType;
  scrape: () => Promise<RawRankItem[]>;
  degradedOnFailure?: boolean;
}> = [
  { routeType: "aicpb", scrape: scrapeAicpb },
  { routeType: "stars", scrape: scrapeAixzdStars },
  { routeType: "month", scrape: scrapeAixzdMonth },
  { routeType: "xhunt_cn", scrape: () => scrapeXhunt("cn"), degradedOnFailure: true },
  { routeType: "xhunt_global", scrape: () => scrapeXhunt("all"), degradedOnFailure: true },
];

function normalizeItems(items: RawRankItem[]) {
  return items
    .filter((item) => item.rank > 0 && item.name && item.externalLink)
    .sort((left, right) => left.rank - right.rank)
    .map((item) => ({
      rank: item.rank,
      name: item.name.trim(),
      description: item.description?.trim() || null,
      logoUrl: item.logoUrl?.trim() || null,
      externalLink: item.externalLink.trim(),
      detailLink: item.detailLink?.trim() || null,
      metricPrimary: item.metricPrimary?.trim() || null,
      metricSecondary: item.metricSecondary?.trim() || null,
      metricTertiary: item.metricTertiary?.trim() || null,
    }));
}

async function recordBatch(routeType: RankRouteType, items: RawRankItem[], errorMsg?: string): Promise<ScrapeResult> {
  const prisma = getPrismaClient();
  const normalizedItems = normalizeItems(items);
  const dbType = RANK_TYPE_TO_DB[routeType];
  const degradedOnFailure = routeType.startsWith("xhunt");
  const hasData = normalizedItems.length > 0;
  const status = hasData ? "success" : degradedOnFailure ? "degraded" : "failed";

  await prisma.scrapeBatch.create({
    data: {
      rankType: dbType,
      status: hasData ? "success" : "failed",
      itemCount: normalizedItems.length,
      errorMsg: hasData ? null : errorMsg || "未抓取到有效数据",
      items: hasData
        ? {
            createMany: {
              data: normalizedItems.map((item) => ({
                rankType: dbType,
                rank: item.rank,
                name: item.name,
                description: item.description,
                logoUrl: item.logoUrl,
                externalLink: item.externalLink,
                detailLink: item.detailLink,
                metricPrimary: item.metricPrimary,
                metricSecondary: item.metricSecondary,
                metricTertiary: item.metricTertiary,
              })),
            },
          }
        : undefined,
    },
  });

  return {
    type: dbType,
    routeType,
    status,
    itemCount: normalizedItems.length,
    errorMsg: hasData ? undefined : errorMsg || "未抓取到有效数据",
  };
}

export async function runAllScrapers(): Promise<ScrapeResult[]> {
  const results = await Promise.all(
    SCRAPERS.map(async ({ routeType, scrape }) => {
      try {
        const items = await scrape();
        return await recordBatch(
          routeType,
          items,
          items.length === 0 ? `${TAB_CONFIG[routeType].shortLabel} 暂未抓到数据` : undefined,
        );
      } catch (error) {
        return await recordBatch(
          routeType,
          [],
          error instanceof Error ? error.message : `${TAB_CONFIG[routeType].shortLabel} 抓取失败`,
        );
      }
    }),
  );

  ["aicpb", "stars", "month", "xhunt_cn", "xhunt_global"].forEach((type) => {
    revalidatePath(`/rank/${type}`);
    revalidatePath(`/api/rank/${type}`);
  });

  return results;
}

export async function getLatestRankPayload(type: RankRouteType): Promise<RankPayload> {
  const prisma = getPrismaClient();
  const dbType = RANK_TYPE_TO_DB[type];
  const latestSuccess = await prisma.scrapeBatch.findFirst({
    where: { rankType: dbType, status: "success" },
    orderBy: { scrapedAt: "desc" },
    include: { items: { orderBy: { rank: "asc" } } },
  });
  const latestBatch = await prisma.scrapeBatch.findFirst({
    where: { rankType: dbType },
    orderBy: { scrapedAt: "desc" },
  });

  if (latestSuccess) {
    return {
      type,
      dbType,
      label: TAB_CONFIG[type].label,
      sourceLabel: TAB_CONFIG[type].sourceLabel,
      sourceStatus: latestBatch?.status === "failed" && latestBatch.scrapedAt > latestSuccess.scrapedAt ? "degraded" : "ready",
      dataMode: "database",
      totalItems: latestSuccess.items.length,
      lastUpdated: latestSuccess.scrapedAt.toISOString(),
      items: latestSuccess.items.map((item: (typeof latestSuccess.items)[number]) => ({
        rank: item.rank,
        name: item.name,
        description: item.description,
        logoUrl: item.logoUrl,
        externalLink: item.externalLink,
        detailLink: item.detailLink,
        metricPrimary: item.metricPrimary,
        metricSecondary: item.metricSecondary,
        metricTertiary: item.metricTertiary,
      })),
      message: latestBatch?.status === "failed" && latestBatch.errorMsg ? latestBatch.errorMsg : undefined,
    };
  }

  if (latestBatch?.status === "failed") {
    return {
      type,
      dbType,
      label: TAB_CONFIG[type].label,
      sourceLabel: TAB_CONFIG[type].sourceLabel,
      sourceStatus: type.startsWith("xhunt") ? "degraded" : "empty",
      dataMode: "database",
      totalItems: 0,
      lastUpdated: latestBatch.scrapedAt.toISOString(),
      items: [],
      message: latestBatch.errorMsg || "当前数据源暂不可用",
    };
  }

  return {
    type,
    dbType,
    label: TAB_CONFIG[type].label,
    sourceLabel: TAB_CONFIG[type].sourceLabel,
    sourceStatus: type.startsWith("xhunt") ? "degraded" : "empty",
    dataMode: "database",
    totalItems: 0,
    lastUpdated: null,
    items: [],
    message: type.startsWith("xhunt") ? "该榜单支持降级展示，稍后可再次尝试抓取。" : "当前还没有抓取到数据，请先执行一次抓取。",
  };
}
