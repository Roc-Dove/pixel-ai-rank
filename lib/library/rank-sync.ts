import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { type RankItemDto, type RankPayload } from "@/types/rank";

const NAME_ALIASES: Record<string, string[]> = {
  perplexity: ["perplexity ai", "perplexity labs"],
  "stable diffusion": ["stability ai"],
  "google gemini": ["gemini"],
  "github copilot": ["copilot"],
  "le chat": ["mistral le chat"],
};

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.ai/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function collectNameKeys(name: string) {
  const normalized = normalizeName(name);
  return [normalized, ...(NAME_ALIASES[normalized] ?? [])];
}

function formatScore(score: number) {
  return String(Math.max(420, Math.min(599, score)));
}

function libraryItemToRankItem(rank: number, baseScore: number, item: ReturnType<typeof getLibraryItemsWithGuide>[number]): RankItemDto {
  return {
    rank,
    name: item.name,
    description: item.descriptionZh,
    logoUrl: null,
    externalLink: item.officialUrl ?? `/library/${item.id}`,
    detailLink: `/library/${item.id}`,
    metricPrimary: formatScore(baseScore),
    metricSecondary: "—",
    metricTertiary: item.category,
  };
}

export function syncLibraryProductsToMonthRank(payload: RankPayload): RankPayload {
  if (payload.type !== "month") return payload;

  const existingNames = new Set<string>();
  payload.items.forEach((item) => {
    collectNameKeys(item.name).forEach((key) => existingNames.add(key));
  });

  const additions = getLibraryItemsWithGuide()
    .filter((item) => item.officialUrl)
    .filter((item) => collectNameKeys(item.name).every((key) => !existingNames.has(key)))
    .sort((a, b) => b.guide.recommendation - a.guide.recommendation || a.name.localeCompare(b.name))
    .map((item, index) => libraryItemToRankItem(payload.items.length + index + 1, 596 - index * 2, item));

  if (additions.length === 0) return payload;

  const items = [...payload.items, ...additions];

  return {
    ...payload,
    totalItems: items.length,
    items,
  };
}
