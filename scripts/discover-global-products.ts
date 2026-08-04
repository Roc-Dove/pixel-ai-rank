import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getServerEnv } from "../lib/env";
import { INDIE_AI_PRODUCTS, MAINSTREAM_AI_PRODUCTS } from "../lib/global-products";
import {
  buildDiscoveryCandidates,
  PRODUCT_DISCOVERY_QUERIES,
  searchTavily,
} from "../lib/product-discovery/tavily";

async function main() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) process.loadEnvFile(file);
  }

  const { TAVILY_API_KEY } = getServerEnv();
  if (!TAVILY_API_KEY) {
    throw new Error("未配置 TAVILY_API_KEY。请在 .env.local 中配置后重新运行 npm run products:discover。");
  }

  const searches = await Promise.all(
    PRODUCT_DISCOVERY_QUERIES.map(async ({ lane, purpose, ...request }) => ({
      lane,
      purpose,
      response: await searchTavily(TAVILY_API_KEY, request),
    })),
  );

  const existingUrls = [...MAINSTREAM_AI_PRODUCTS, ...INDIE_AI_PRODUCTS].map((item) => item.productUrl);
  const candidates = buildDiscoveryCandidates(searches, existingUrls);
  const report = {
    generatedAt: new Date().toISOString(),
    provider: "Tavily Search API",
    editorialReviewRequired: true,
    queries: PRODUCT_DISCOVERY_QUERIES,
    candidates,
  };

  const outputDirectory = join(process.cwd(), ".tmp-product-discovery");
  mkdirSync(outputDirectory, { recursive: true });
  const outputPath = join(outputDirectory, `tavily-candidates-${report.generatedAt.slice(0, 10)}.json`);
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const newProductDomains = candidates.filter((item) => item.isNewProductDomain).length;
  const evidenceSources = candidates.filter((item) => item.sourceRole === "maker-evidence").length;
  console.log(`Tavily 返回 ${candidates.length} 条去重结果：${newProductDomains} 个待审产品域名，${evidenceSources} 条创始人证据。`);
  console.log(`候选报告：${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Tavily 产品发现失败");
  process.exitCode = 1;
});
