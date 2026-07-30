import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";
import { getSuccessfulBatchStatus } from "@/lib/rank-freshness";
import { RANK_TYPE_TO_DB, TAB_CONFIG, type RankPayload, type RankRouteType } from "@/types/rank";

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
    const sourceStatus = getSuccessfulBatchStatus(latestSuccess.scrapedAt, latestBatch);
    const staleMessage =
      sourceStatus === "stale"
        ? "最近一次成功抓取已超过 72 小时，当前数据仅供历史参考，请等待下一次更新。"
        : undefined;
    const latestFailureMessage =
      latestBatch?.status === "failed" && latestBatch.errorMsg
        ? latestBatch.errorMsg
        : undefined;

    return {
      type,
      dbType,
      label: TAB_CONFIG[type].label,
      sourceLabel: TAB_CONFIG[type].databaseSourceLabel,
      sourceStatus,
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
      message: [staleMessage, latestFailureMessage].filter(Boolean).join(" ") || undefined,
    };
  }

  if (latestBatch?.status === "failed") {
    return {
      type,
      dbType,
      label: TAB_CONFIG[type].label,
      sourceLabel: TAB_CONFIG[type].databaseSourceLabel,
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
    sourceLabel: TAB_CONFIG[type].databaseSourceLabel,
    sourceStatus: type.startsWith("xhunt") ? "degraded" : "empty",
    dataMode: "database",
    totalItems: 0,
    lastUpdated: null,
    items: [],
    message: type.startsWith("xhunt") ? "该榜单支持降级展示，稍后可再次尝试抓取。" : "当前还没有抓取到数据，请先执行一次抓取。",
  };
}
