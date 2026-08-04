import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDiscoveryCandidates,
  searchTavily,
  TAVILY_SEARCH_ENDPOINT,
  type TavilySearchResponse,
} from "../lib/product-discovery/tavily";

test("Tavily search keeps the API key in the authorization header", async () => {
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(input, TAVILY_SEARCH_ENDPOINT);
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer test-secret");
    assert.deepEqual(JSON.parse(String(init?.body)), {
      query: "international AI products",
      topic: "general",
      search_depth: "basic",
      max_results: 8,
      include_answer: false,
      include_raw_content: false,
    });
    return new Response(JSON.stringify({ query: "international AI products", results: [] }));
  }) as typeof fetch;

  const result = await searchTavily("test-secret", "international AI products", fetchImpl);
  assert.equal(result.results.length, 0);
});

test("Tavily search forwards discovery filters without putting the key in the body", async () => {
  const fetchImpl = (async (_input: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(JSON.stringify(body).includes("test-secret"), false);
    assert.deepEqual(body, {
      query: "bootstrapped AI product",
      topic: "general",
      search_depth: "advanced",
      max_results: 10,
      include_answer: false,
      include_raw_content: false,
      include_domains: ["indiehackers.com"],
      exclude_domains: ["reddit.com"],
    });
    return new Response(JSON.stringify({ query: body.query, results: [] }));
  }) as typeof fetch;

  await searchTavily("test-secret", {
    query: "bootstrapped AI product",
    searchDepth: "advanced",
    maxResults: 10,
    includeDomains: ["indiehackers.com"],
    excludeDomains: ["reddit.com"],
  }, fetchImpl);
});

test("Tavily product homepages are deduplicated and flag existing products", () => {
  const response: TavilySearchResponse = {
    query: "indie AI products",
    results: [
      { title: "Known", url: "https://www.example.com/?ref=search", content: "known", score: 0.8 },
      { title: "Known duplicate", url: "https://www.example.com/#top", content: "duplicate", score: 0.7 },
      { title: "New", url: "https://new-ai.app/", content: "new candidate", score: 0.9 },
    ],
  };

  const candidates = buildDiscoveryCandidates([{ lane: "indie", purpose: "product-site", response }], ["https://example.com"]);

  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].domain, "new-ai.app");
  assert.equal(candidates[0].alreadyListed, false);
  assert.equal(candidates[0].isNewProductDomain, true);
  assert.equal(candidates[0].sourceRole, "product-site");
  assert.equal(candidates[1].alreadyListed, true);
});

test("Tavily article results require review instead of being counted as product domains", () => {
  const response: TavilySearchResponse = {
    query: "AI product",
    results: [
      { title: "AI product roundup", url: "https://publisher.example/articles/ai-products", content: "roundup", score: 0.8 },
    ],
  };

  const [candidate] = buildDiscoveryCandidates(
    [{ lane: "mainstream", purpose: "product-site", response }],
    [],
  );

  assert.equal(candidate.sourceRole, "review-needed");
  assert.equal(candidate.isNewProductDomain, false);
});

test("Tavily evidence searches stay evidence instead of being counted as product domains", () => {
  const response: TavilySearchResponse = {
    query: "solo founder AI product",
    results: [
      { title: "Founder story", url: "https://www.indiehackers.com/post/founder-story", content: "evidence", score: 0.9 },
    ],
  };

  const [candidate] = buildDiscoveryCandidates(
    [{ lane: "indie", purpose: "maker-evidence", response }],
    [],
  );

  assert.equal(candidate.sourceRole, "maker-evidence");
  assert.equal(candidate.isNewProductDomain, false);
});
