export const RANK_TYPES = ["aicpb", "stars", "month", "xhunt_cn", "xhunt_global"] as const;

export type RankRouteType = (typeof RANK_TYPES)[number];
export type DbRankType = "AICPB" | "AIXZD_STARS" | "AIXZD_MONTH" | "XHUNT_CN" | "XHUNT_GLOBAL";
export type SourceStatus = "ready" | "degraded" | "empty";
export type DataMode = "database" | "demo";
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
    summary: string;
  }
> = {
  aicpb: {
    label: "LV.1 出海精选",
    shortLabel: "出海榜",
    navLabel: "出海榜",
    icon: "🌏",
    tone: "red",
    sourceLabel: "Pixel AI Rank 精选",
    summary: "基于 AI库导购字段筛选适合海外市场、英文用户和出海团队的 AI 产品。",
  },
  stars: {
    label: "LV.2 趋势新品",
    shortLabel: "新品榜",
    navLabel: "新品榜",
    icon: "⭐",
    tone: "blue",
    sourceLabel: "Pixel AI Rank 精选",
    summary: "基于 AI库里的 Agent、编程、视频、设计和自动化方向，观察近期更值得关注的新趋势工具。",
  },
  month: {
    label: "LV.3 综合月榜",
    shortLabel: "月榜",
    navLabel: "月榜",
    icon: "📅",
    tone: "green",
    sourceLabel: "Pixel AI Rank 精选",
    summary: "基于 AI库推荐指数、上手难度、人群覆盖和中文友好度计算的本站综合推荐榜。",
  },
  xhunt_cn: {
    label: "LV.4 KOL CN",
    shortLabel: "KOL 中文",
    navLabel: "KOL 中文",
    icon: "🐦",
    tone: "yellow",
    sourceLabel: "Pixel AI Rank 精选",
    summary: "精选中文圈 AI 创作者、产品观察者和信息源，适合跟踪中文 AI 传播影响力。",
  },
  xhunt_global: {
    label: "LV.5 KOL Global",
    shortLabel: "KOL 全球",
    navLabel: "KOL 全球",
    icon: "🌐",
    tone: "purple",
    sourceLabel: "Pixel AI Rank 精选",
    summary: "精选全球 AI 研究、产品、开发者生态和商业应用领域的高信号账号。",
  },
};

export function isRankRouteType(value: string): value is RankRouteType {
  return (RANK_TYPES as readonly string[]).includes(value);
}

export function toDbRankType(type: RankRouteType): DbRankType {
  return RANK_TYPE_TO_DB[type];
}
