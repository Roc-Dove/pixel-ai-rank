import { type RawRankItem } from "@/types/rank";
import { loadHtml, requestHtml, safeSlice, sanitizeText } from "@/lib/utils/scrape";

const AICPB_URL = "https://www.aicpb.com/zh/ai-rankings/products/china-ai-growth-rate-ranking/websites";

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
              externalLink: detailLink,
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

      fallbackItems.push({
        rank: index + 1,
        name,
        description: null,
        logoUrl: null,
        detailLink: new URL(href, AICPB_URL).toString(),
        externalLink: new URL(href, AICPB_URL).toString(),
        metricPrimary: null,
        metricSecondary: null,
        metricTertiary: null,
      });
    });

    return safeSlice(fallbackItems, 50);
  } catch {
    return [];
  }
}
