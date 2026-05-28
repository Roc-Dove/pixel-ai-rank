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
    label: "LV.1 出海榜",
    shortLabel: "出海榜",
    navLabel: "出海榜",
    icon: "🌏",
    tone: "red",
    sourceLabel: "aicpb.com",
    summary: "中国 AI 出海产品增长榜，适合快速判断近期增长势头。",
  },
  stars: {
    label: "LV.2 新品榜",
    shortLabel: "新品榜",
    navLabel: "新品榜",
    icon: "⭐",
    tone: "blue",
    sourceLabel: "aixzd.com/stars",
    summary: "AI 新产品星锐榜，聚焦近期热度上升的新面孔。",
  },
  month: {
    label: "LV.3 月榜",
    shortLabel: "月榜",
    navLabel: "月榜",
    icon: "📅",
    tone: "green",
    sourceLabel: "aixzd.com/month",
    summary: "AI 产品月度榜单，用于观察上个月的整体竞争格局。",
  },
  xhunt_cn: {
    label: "LV.4 KOL CN",
    shortLabel: "KOL 中文",
    navLabel: "KOL 中文",
    icon: "🐦",
    tone: "yellow",
    sourceLabel: "kol.xhunt.ai/cn",
    summary: "AI KOL 中文榜，适合跟踪中文圈传播影响力。",
  },
  xhunt_global: {
    label: "LV.5 KOL Global",
    shortLabel: "KOL 全球",
    navLabel: "KOL 全球",
    icon: "🌐",
    tone: "purple",
    sourceLabel: "kol.xhunt.ai/global",
    summary: "AI KOL 全球榜，观察全球创作者与意见领袖趋势。",
  },
};

export function isRankRouteType(value: string): value is RankRouteType {
  return (RANK_TYPES as readonly string[]).includes(value);
}

export function toDbRankType(type: RankRouteType): DbRankType {
  return RANK_TYPE_TO_DB[type];
}
