export const SITE_NAME = "Pixel AI Rank";
export const SITE_URL = "https://www.pixel-ai-rank.online";
export const SITE_DESCRIPTION =
  "面向中国 AI 产品团队的产品、KOL、OPC 与出海增长导航，追踪海外分发、渠道、本地化、支付与平台规则。";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
