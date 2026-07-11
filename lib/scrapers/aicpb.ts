import { type RawRankItem } from "@/types/rank";
import { loadHtml, requestHtml, safeSlice, sanitizeText } from "@/lib/utils/scrape";

const AICPB_URL = "https://www.aicpb.com/zh/ai-rankings/products/china-ai-growth-rate-ranking/websites";
const OFFICIAL_LINK_OVERRIDES: Array<{ pattern: RegExp; url: string }> = [
  { pattern: /智谱|z\.ai/i, url: "https://z.ai" },
  { pattern: /lovart/i, url: "https://lovart.ai" },
  { pattern: /gamma/i, url: "https://gamma.app" },
  { pattern: /vidu/i, url: "https://www.vidu.com" },
  { pattern: /monica/i, url: "https://monica.im" },
];

type AicpbJsonLd = {
  "@graph"?: Array<{
    "@type"?: string | string[];
    itemListElement?: Array<{
      position?: number;
      item?: {
        name?: string;
        url?: string;
      };
    }>;
  }>;
};

function resolveOfficialLink(name: string, fallback: string) {
  return OFFICIAL_LINK_OVERRIDES.find((entry) => entry.pattern.test(name))?.url ?? fallback;
}

function parseFromJsonLd(html: string): RawRankItem[] {
  const matches = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g));

  for (const match of matches) {
    try {
      const data = JSON.parse(match[1]) as AicpbJsonLd;
      const ranking = data["@graph"]?.find((entry) => {
        const typeValue = entry["@type"];
        return Array.isArray(typeValue) ? typeValue.includes("ItemList") : typeValue === "ItemList";
      });
      const items =
        ranking?.itemListElement
          ?.map((entry) => {
            const rank = entry.position;
            const name = sanitizeText(entry.item?.name);
            const detailLink = sanitizeText(entry.item?.url);

            if (!rank || !name || !detailLink) return null;

            return {
              rank,
              name,
              description: null,
              logoUrl: null,
              detailLink,
              externalLink: resolveOfficialLink(name, detailLink),
              metricPrimary: null,
              metricSecondary: null,
              metricTertiary: null,
            } satisfies RawRankItem;
          })
          .filter(Boolean) as RawRankItem[] | undefined;

      if (items?.length) return items;
    } catch {
      continue;
    }
  }

  return [];
}

export async function scrapeAicpb(): Promise<RawRankItem[]> {
  try {
    const html = await requestHtml(AICPB_URL);
    const jsonLdItems = parseFromJsonLd(html);
    if (jsonLdItems.length > 0) return safeSlice(jsonLdItems, 50);

    const $ = loadHtml(html);
    const fallbackItems: RawRankItem[] = [];
    $('a[href^="/zh/product/"], a[href*="/zh/product/"]').each((index, element) => {
      const href = $(element).attr("href");
      const name = sanitizeText($(element).text());
      if (!href || !name) return;

      const detailLink = new URL(href, AICPB_URL).toString();

      fallbackItems.push({
        rank: index + 1,
        name,
        description: null,
        logoUrl: null,
        detailLink,
        externalLink: resolveOfficialLink(name, detailLink),
        metricPrimary: null,
        metricSecondary: null,
        metricTertiary: null,
      });
    });

    return safeSlice(fallbackItems, 50);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`AICPB 抓取失败：${reason}`, { cause: error });
  }
}
