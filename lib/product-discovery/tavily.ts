import { z } from "zod";

export const TAVILY_SEARCH_ENDPOINT = "https://api.tavily.com/search";

export type ProductLane = "mainstream" | "indie";
export type ProductDiscoveryPurpose = "product-site" | "maker-evidence";
export type ProductDiscoverySourceRole = ProductDiscoveryPurpose | "editorial" | "review-needed";

export type ProductDiscoveryQuery = {
  lane: ProductLane;
  purpose: ProductDiscoveryPurpose;
  query: string;
  searchDepth?: "basic" | "advanced";
  maxResults?: number;
  includeDomains?: readonly string[];
  excludeDomains?: readonly string[];
};

export type ProductDiscoveryCandidate = {
  lane: ProductLane;
  purpose: ProductDiscoveryPurpose;
  sourceRole: ProductDiscoverySourceRole;
  query: string;
  title: string;
  url: string;
  domain: string;
  summary: string;
  score: number;
  alreadyListed: boolean;
  isNewProductDomain: boolean;
};

const EDITORIAL_DOMAINS = new Set([
  "capterra.com",
  "fortune.com",
  "g2.com",
  "indiehackers.com",
  "instagram.com",
  "linkedin.com",
  "medium.com",
  "producthunt.com",
  "reddit.com",
  "techcrunch.com",
  "youtube.com",
]);

const PRODUCT_SEARCH_EXCLUDED_DOMAINS = [...EDITORIAL_DOMAINS];

const tavilyResponseSchema = z.object({
  query: z.string(),
  results: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    content: z.string().default(""),
    score: z.number().default(0),
  })),
  request_id: z.string().optional(),
  response_time: z.union([z.string(), z.number()]).optional(),
});

export type TavilySearchResponse = z.infer<typeof tavilyResponseSchema>;

export const PRODUCT_DISCOVERY_QUERIES: readonly ProductDiscoveryQuery[] = [
  {
    lane: "mainstream",
    purpose: "product-site",
    query: "official AI video audio image design product website start free global creators",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "mainstream",
    purpose: "product-site",
    query: "official AI coding agent app builder developer product website get started free global",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "mainstream",
    purpose: "product-site",
    query: "official AI meeting research knowledge writing translation software website free plan international users",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "mainstream",
    purpose: "product-site",
    query: "official AI customer support sales marketing analytics automation product website start free global teams",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "mainstream",
    purpose: "product-site",
    query: "leading AI application official homepage available worldwide self serve pricing 2026",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "indie",
    purpose: "product-site",
    query: "bootstrapped solo founder AI SaaS official product homepage pricing global customers",
    searchDepth: "advanced",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "indie",
    purpose: "product-site",
    query: "small team independent AI app official homepage creators productivity design international users",
    searchDepth: "advanced",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "indie",
    purpose: "product-site",
    query: "solo developer local first AI Mac desktop app official website worldwide download",
    searchDepth: "advanced",
    maxResults: 10,
    excludeDomains: PRODUCT_SEARCH_EXCLUDED_DOMAINS,
  },
  {
    lane: "indie",
    purpose: "maker-evidence",
    query: "AI product solo founder bootstrapped revenue team size founder story",
    searchDepth: "advanced",
    maxResults: 10,
    includeDomains: ["indiehackers.com", "levels.io", "news.tonydinh.com"],
  },
  {
    lane: "indie",
    purpose: "maker-evidence",
    query: "AI SaaS solo founder product MRR bootstrapped small team interview",
    searchDepth: "advanced",
    maxResults: 10,
    includeDomains: ["indiehackers.com", "starterstory.com", "microconf.com", "levels.io"],
  },
] as const;

type TavilySearchRequest = string | Pick<
  ProductDiscoveryQuery,
  "query" | "searchDepth" | "maxResults" | "includeDomains" | "excludeDomains"
>;

export async function searchTavily(
  apiKey: string,
  request: TavilySearchRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<TavilySearchResponse> {
  const key = apiKey.trim();
  if (!key) throw new Error("TAVILY_API_KEY is required");
  const options = typeof request === "string" ? { query: request } : request;

  const response = await fetchImpl(TAVILY_SEARCH_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: options.query,
      topic: "general",
      search_depth: options.searchDepth ?? "basic",
      max_results: options.maxResults ?? 8,
      include_answer: false,
      include_raw_content: false,
      ...(options.includeDomains?.length ? { include_domains: options.includeDomains } : {}),
      ...(options.excludeDomains?.length ? { exclude_domains: options.excludeDomains } : {}),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed with HTTP ${response.status}`);
  }

  return tavilyResponseSchema.parse(await response.json());
}

function normalizeUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

function hostname(value: string) {
  return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
}

function isLikelyProductHomepage(value: string) {
  const pathname = new URL(value).pathname.replace(/\/+$/, "");
  return pathname === "";
}

export function buildDiscoveryCandidates(
  searches: readonly {
    lane: ProductLane;
    purpose?: ProductDiscoveryPurpose;
    response: TavilySearchResponse;
  }[],
  existingProductUrls: readonly string[],
) {
  const knownDomains = new Set(existingProductUrls.map(hostname));
  const candidates = new Map<string, ProductDiscoveryCandidate>();

  for (const search of searches) {
    for (const result of search.response.results) {
      const url = normalizeUrl(result.url);
      const domain = hostname(url);
      const purpose = search.purpose ?? "product-site";
      const sourceRole: ProductDiscoverySourceRole = purpose === "maker-evidence"
        ? "maker-evidence"
        : EDITORIAL_DOMAINS.has(domain)
          ? "editorial"
          : isLikelyProductHomepage(url)
            ? "product-site"
            : "review-needed";
      const candidateKey = sourceRole === "product-site" ? `product:${domain}` : `source:${url}`;
      const previous = candidates.get(candidateKey);
      if (previous && previous.score >= result.score) continue;

      const alreadyListed = sourceRole === "product-site" && knownDomains.has(domain);
      candidates.set(candidateKey, {
        lane: search.lane,
        purpose,
        sourceRole,
        query: search.response.query,
        title: result.title.trim(),
        url,
        domain,
        summary: result.content.trim(),
        score: result.score,
        alreadyListed,
        isNewProductDomain: sourceRole === "product-site" && !alreadyListed,
      });
    }
  }

  return [...candidates.values()].sort((left, right) => right.score - left.score);
}
