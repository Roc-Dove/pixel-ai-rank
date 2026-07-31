import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { type LibraryItemWithGuide } from "@/types/library";
import { type RankItemDto, type RankPayload, type RankRouteType } from "@/types/rank";

type SelectedRankType = Extract<RankRouteType, "stars" | "month">;

function isSelectedRankType(type: RankRouteType): type is SelectedRankType {
  return type === "stars" || type === "month";
}

function formatScore(score: number) {
  return String(Math.max(420, Math.min(999, Math.round(score))));
}

function categoryBoost(item: LibraryItemWithGuide, categories: string[], boost: number) {
  return categories.includes(item.category) ? boost : 0;
}

function audienceBoost(item: LibraryItemWithGuide, audience: string, boost: number) {
  return item.guide.audiences.includes(audience as never) ? boost : 0;
}

function trendScore(item: LibraryItemWithGuide) {
  return (
    item.guide.recommendation * 7 +
    categoryBoost(item, ["AI Agent", "AI 编程", "AI 视频生成", "AI 设计", "AI 自动化"], 88) +
    audienceBoost(item, "创业者/产品经理", 42) +
    audienceBoost(item, "开发者", 32) -
    (item.guide.difficulty === "高" ? 18 : 0)
  );
}

function monthlyScore(item: LibraryItemWithGuide) {
  return (
    item.guide.recommendation * 7 +
    item.guide.audiences.length * 18 +
    (item.guide.isChineseFriendly ? 46 : 0) +
    (item.guide.isGoodForCreators ? 24 : 0) +
    (item.guide.isGoodForBuilders ? 24 : 0) +
    (item.guide.isGoodForGlobal ? 20 : 0) -
    (item.guide.difficulty === "高" ? 24 : item.guide.difficulty === "中" ? 8 : 0)
  );
}

function rankConfig(type: SelectedRankType) {
  if (type === "stars") {
    return {
      primaryLabel: "趋势潜力",
      secondaryLabel: "编辑评分",
      score: trendScore,
      filter: (item: LibraryItemWithGuide) => ["AI Agent", "AI 编程", "AI 视频生成", "AI 设计", "AI 自动化"].includes(item.category),
    };
  }

  return {
    primaryLabel: "综合评分",
    secondaryLabel: "编辑评分",
    score: monthlyScore,
    filter: () => true,
  };
}

function toRankItem(type: RankRouteType, rank: number, item: LibraryItemWithGuide, rawScore: number): RankItemDto {
  return {
    rank,
    name: item.name,
    description: item.descriptionZh,
    logoUrl: null,
    externalLink: item.officialUrl ?? `/library/${item.id}`,
    detailLink: `/library/${item.id}`,
    metricPrimary: formatScore(rawScore),
    metricSecondary: String(item.guide.recommendation),
    metricTertiary: item.category,
  };
}

export function buildSelectedLibraryRankPayload(payload: RankPayload): RankPayload {
  if (!isSelectedRankType(payload.type)) return payload;
  if (payload.dataMode === "database" && payload.items.length > 0) return payload;

  const config = rankConfig(payload.type);
  const scoredItems = getLibraryItemsWithGuide()
    .filter((item) => item.officialUrl)
    .filter(config.filter)
    .map((item) => ({ item, score: config.score(item) }))
    .sort((a, b) => b.score - a.score || b.item.guide.recommendation - a.item.guide.recommendation || a.item.name.localeCompare(b.item.name));

  const items = scoredItems.map(({ item, score }, index) => toRankItem(payload.type, index + 1, item, score));

  return {
    ...payload,
    sourceLabel: "Pixel AI Rank 精选",
    sourceStatus: "ready",
    dataMode: "curated",
    totalItems: items.length,
    lastUpdated: null,
    items,
    message: `${config.primaryLabel} = 基于 AI 库评测字段、适用人群、分类和可用官网综合计算。${config.secondaryLabel}来自 AI 库编辑评分。`,
  };
}
