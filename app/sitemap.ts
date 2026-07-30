import type { MetadataRoute } from "next";
import { LIBRARY_ITEMS } from "@/lib/library/items";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { absoluteUrl } from "@/lib/site";
import { RANK_TYPES } from "@/types/rank";

export default function sitemap(): MetadataRoute.Sitemap {
  const verifiedAt = `${SIGNALS_LAST_VERIFIED}T00:00:00+08:00`;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: verifiedAt,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/signals"),
      lastModified: verifiedAt,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/library"),
      lastModified: verifiedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...RANK_TYPES.map((type) => ({
      url: absoluteUrl(`/rank/${type}`),
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...SIGNAL_ITEMS.map((item) => ({
      url: absoluteUrl(`/signals/${item.id}`),
      lastModified: `${item.date}T00:00:00+08:00`,
      changeFrequency: "monthly" as const,
      priority: item.featured ? 0.8 : 0.7,
    })),
    ...LIBRARY_ITEMS.map((item) => ({
      url: absoluteUrl(`/library/${item.id}`),
      lastModified: item.verifiedAt ? `${item.verifiedAt}T00:00:00+08:00` : undefined,
      changeFrequency: "monthly" as const,
      priority: item.verifiedAt ? 0.7 : 0.55,
    })),
  ];
}
