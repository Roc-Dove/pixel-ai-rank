import { buildDemoRankPayload } from "@/lib/mock/rank";
import { getLatestRankPayload } from "@/lib/scrapers";
import { getServerEnv } from "@/lib/env";
import { type RankPayload, type RankRouteType } from "@/types/rank";

const DATABASE_READ_TIMEOUT_MS = 3500;
const DATABASE_FALLBACK_MESSAGE = "当前数据库暂时不可用，页面正在展示内置演示数据。";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("DATABASE_READ_TIMEOUT"));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export async function getRankPayload(type: RankRouteType): Promise<RankPayload> {
  const env = getServerEnv();

  if (!env.DATABASE_URL && !env.DIRECT_URL) {
    return buildDemoRankPayload(type);
  }

  try {
    return await withTimeout(getLatestRankPayload(type), DATABASE_READ_TIMEOUT_MS);
  } catch (error) {
    console.warn("[rank-data] Falling back to demo data:", error);
    return buildDemoRankPayload(type, DATABASE_FALLBACK_MESSAGE);
  }
}
