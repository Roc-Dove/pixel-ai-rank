export const RANK_TYPES = ["aicpb", "stars", "month", "xhunt_cn", "xhunt_global"] as const;

export type RankRouteType = (typeof RANK_TYPES)[number];
export type DbRankType = "AICPB" | "AIXZD_STARS" | "AIXZD_MONTH" | "XHUNT_CN" | "XHUNT_GLOBAL";
export type SourceStatus = "ready" | "stale" | "degraded" | "empty";
export type DataMode = "database" | "curated" | "demo";
export type PixelTone = "red" | "blue" | "green" | "yellow" | "purple" | "ghost";

export type RawRankItem = {
  rank: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  externalLink: string;
  detailLink?: string | null;
  metricPrimary?: string | null;
  metricSecondary?: string | null;
  metricTertiary?: string | null;
};

export type RankItemDto = {
  rank: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  externalLink: string;
  detailLink: string | null;
  metricPrimary: string | null;
  metricSecondary: string | null;
  metricTertiary: string | null;
};

export type RankPayload = {
  type: RankRouteType;
  dbType: DbRankType;
  label: string;
  sourceLabel: string;
  sourceStatus: SourceStatus;
  dataMode: DataMode;
  totalItems: number;
  lastUpdated: string | null;
  items: RankItemDto[];
  message?: string;
};

export type ScrapeResult = {
  type: DbRankType;
  routeType: RankRouteType;
  status: "success" | "failed" | "degraded";
  itemCount: number;
  errorMsg?: string;
};

export const RANK_TYPE_TO_DB: Record<RankRouteType, DbRankType> = {
  aicpb: "AICPB",
  stars: "AIXZD_STARS",
  month: "AIXZD_MONTH",
  xhunt_cn: "XHUNT_CN",
  xhunt_global: "XHUNT_GLOBAL",
};

export const DB_TO_RANK_TYPE: Record<DbRankType, RankRouteType> = {
  AICPB: "aicpb",
  AIXZD_STARS: "stars",
  AIXZD_MONTH: "month",
  XHUNT_CN: "xhunt_cn",
  XHUNT_GLOBAL: "xhunt_global",
};

export const TAB_CONFIG: Record<
  RankRouteType,
  {
    label: string;
    shortLabel: string;
    navLabel: string;
    icon: string;
    tone: PixelTone;
    sourceLabel: string;
    databaseSourceLabel: string;
    summary: string;
  }
> = {
  aicpb: {
    label: "国际化 AI 产品",
    shortLabel: "国际 AI 产品",
    navLabel: "国际 AI 产品",
    icon: "🌏",
    tone: "red",
    sourceLabel: "Pixel AI Rank 国际化产品精选",
    databaseSourceLabel: "AICPB 中国 AI 产品增长榜",
    summary: "浏览面向全球用户的主流 AI 软件与独立开发者产品，观察产品形态、使用场景、收费方式和国际化路径。",
  },
  stars: {
    label: "AI 产品新品榜",
    shortLabel: "新品榜",
    navLabel: "新品榜",
    icon: "⭐",
    tone: "blue",
    sourceLabel: "Pixel AI Rank 精选",
    databaseSourceLabel: "AI工具集（AIXZD）趋势新品榜",
    summary: "基于 AI 库里的 Agent、编程、视频、设计和自动化方向，整理近期新趋势工具。",
  },
  month: {
    label: "AI 产品月榜",
    shortLabel: "月榜",
    navLabel: "月榜",
    icon: "📅",
    tone: "green",
    sourceLabel: "Pixel AI Rank 精选",
    databaseSourceLabel: "AI工具集（AIXZD）综合月榜",
    summary: "基于 AI 库编辑评分、上手难度、人群覆盖和中文友好度计算的本站综合评分榜。",
  },
  xhunt_cn: {
    label: "中文 AI KOL",
    shortLabel: "KOL 中文",
    navLabel: "KOL 中文",
    icon: "🐦",
    tone: "yellow",
    sourceLabel: "Pixel AI Rank 精选",
    databaseSourceLabel: "Xhunt AI KOL 榜 · 中文",
    summary: "跟踪中文圈 AI 产品、创业增长与开发者生态创作者；本站精选与外部抓取会分开标注。",
  },
  xhunt_global: {
    label: "Global AI KOL",
    shortLabel: "KOL 全球",
    navLabel: "KOL 全球",
    icon: "🌐",
    tone: "purple",
    sourceLabel: "Pixel AI Rank 精选",
    databaseSourceLabel: "Xhunt AI KOL 榜 · 全球",
    summary: "跟踪全球 AI 产品、开发者生态、创业增长与商业应用领域的创作者和一线账号。",
  },
};

export function isRankRouteType(value: string): value is RankRouteType {
  return (RANK_TYPES as readonly string[]).includes(value);
}

export function toDbRankType(type: RankRouteType): DbRankType {
  return RANK_TYPE_TO_DB[type];
}
