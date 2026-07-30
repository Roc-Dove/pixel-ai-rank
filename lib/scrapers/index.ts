import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/db/prisma";
import { scrapeAicpb } from "@/lib/scrapers/aicpb";
import { scrapeAixzdMonth } from "@/lib/scrapers/aixzd-month";
import { scrapeAixzdStars } from "@/lib/scrapers/aixzd-stars";
import { scrapeXhunt } from "@/lib/scrapers/xhunt";
import { RANK_TYPE_TO_DB, TAB_CONFIG, type RawRankItem, type RankRouteType, type ScrapeResult } from "@/types/rank";

const SCRAPERS: Array<{
  routeType: RankRouteType;
  scrape: () => Promise<RawRankItem[]>;
  usesBrowser?: boolean;
}> = [
  { routeType: "aicpb", scrape: scrapeAicpb },
  { routeType: "stars", scrape: scrapeAixzdStars },
  { routeType: "month", scrape: scrapeAixzdMonth },
  { routeType: "xhunt_cn", scrape: () => scrapeXhunt("cn"), usesBrowser: true },
  { routeType: "xhunt_global", scrape: () => scrapeXhunt("all"), usesBrowser: true },
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
  async function runScraper({ routeType, scrape }: (typeof SCRAPERS)[number]) {
    try {
      const items = await scrape();
      return await recordBatch(
        routeType,
        items,
        items.length === 0 ? `${TAB_CONFIG[routeType].shortLabel} 暂未抓到数据` : undefined,
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : `${TAB_CONFIG[routeType].shortLabel} 抓取失败`;
      console.error(`[scraper:${routeType}] ${errorMsg}`, error);
      return await recordBatch(routeType, [], errorMsg);
    }
  }

  const httpScrapers = SCRAPERS.filter((scraper) => !scraper.usesBrowser);
  const browserScrapers = SCRAPERS.filter((scraper) => scraper.usesBrowser);

  const httpResultsPromise = Promise.all(httpScrapers.map(runScraper));
  const browserResultsPromise = (async () => {
    const browserResults: ScrapeResult[] = [];
    for (const scraper of browserScrapers) {
      browserResults.push(await runScraper(scraper));
    }
    return browserResults;
  })();

  const [httpResults, browserResults] = await Promise.all([httpResultsPromise, browserResultsPromise]);
  const results = [...httpResults, ...browserResults];

  ["aicpb", "stars", "month", "xhunt_cn", "xhunt_global"].forEach((type) => {
    revalidatePath(`/rank/${type}`);
    revalidatePath(`/api/rank/${type}`);
  });

  return results;
}
