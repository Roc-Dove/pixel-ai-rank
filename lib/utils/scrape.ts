import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function randomDelay() {
  const delay = 1000 + Math.floor(Math.random() * 2000);
  await sleep(delay);
}

export async function requestHtml(url: string) {
  await randomDelay();
  const response = await axios.get<string>(url, {
    timeout: 20000,
    // Public source pages in local development should not depend on a system proxy
    // that may be present but unavailable.
    proxy: false,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      Referer: url,
    },
  });
  return response.data;
}

export function loadHtml(html: string) {
  return cheerio.load(html);
}

export function absolutizeUrl(url: string | undefined | null, baseUrl: string) {
  if (!url) return null;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return null;
  }
}

export function decodeAixzdRedirect(url: string | undefined | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url, "https://aixzd.com");
    const redirect = parsed.searchParams.get("redirect");
    if (redirect) return decodeURIComponent(redirect);
    return parsed.toString();
  } catch {
    return null;
  }
}

export function sanitizeText(value: string | undefined | null) {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, " ").replace(/[ ]/g, " ").trim();
  return cleaned || null;
}

export function extractFirstText(list: Array<string | null | undefined>, fallback: string | null = null) {
  for (const item of list) {
    const cleaned = sanitizeText(item);
    if (cleaned) return cleaned;
  }
  return fallback;
}

export function collectText($root: { text(): string }) {
  return sanitizeText($root.text());
}

export function safeSlice<T>(items: T[], limit = 50) {
  return items.slice(0, limit);
}
