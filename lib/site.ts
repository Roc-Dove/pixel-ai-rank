export const SITE_NAME = "Pixel AI Rank";
export const SITE_URL = "https://www.pixel-ai-rank.online";
export const SITE_DESCRIPTION =
  "聚合官方 AI 最新发布、产品榜、KOL 信号与中文工具导购，补充影响判断与下一步行动。";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
