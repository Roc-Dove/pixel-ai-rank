export const SITE_NAME = "Pixel AI Rank";
export const SITE_URL = "https://www.pixel-ai-rank.online";
export const SITE_DESCRIPTION =
  "面向中国 AI 产品团队的产品、KOL、OPC 与出海增长导航，追踪海外分发、渠道、本地化、支付与平台规则。";
export const SOCIAL_IMAGE = {
  url: "/og-international.png",
  width: 1200,
  height: 630,
  alt: "Pixel AI Rank 全球主流与 Indie 出海产品",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
