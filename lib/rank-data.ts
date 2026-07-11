import { createConnection } from "node:net";
import { getPrismaClient } from "@/lib/db/prisma";
import { buildDemoRankPayload } from "@/lib/mock/rank";
import { getLatestRankPayload } from "@/lib/scrapers";
import { getServerEnv } from "@/lib/env";
import { buildSelectedLibraryRankPayload } from "@/lib/library/rank-sync";
import { type RankPayload, type RankRouteType } from "@/types/rank";

const DATABASE_READ_TIMEOUT_MS = 1500;
const DATABASE_PREFLIGHT_TIMEOUT_MS = 800;
const DATABASE_CIRCUIT_BREAKER_MS = 60_000;
const DATABASE_FALLBACK_MESSAGE = "当前数据库暂时不可用，页面正在展示内置演示数据。";
const KOL_MINIMUM_ITEMS = 20;
let databaseOfflineUntil = 0;
let databaseOnlineUntil = 0;
let databaseHealthCheck: Promise<boolean> | null = null;

function canReachDatabase(rawUrl: string): Promise<boolean> {
  if (Date.now() < databaseOfflineUntil) return Promise.resolve(false);

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    databaseOfflineUntil = Date.now() + DATABASE_CIRCUIT_BREAKER_MS;
    return Promise.resolve(false);
  }

  const port = Number.parseInt(url.port || "5432", 10);

  return new Promise((resolve) => {
    let settled = false;
    const socket = createConnection({ host: url.hostname, port });
    const finish = (reachable: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      if (!reachable) databaseOfflineUntil = Date.now() + DATABASE_CIRCUIT_BREAKER_MS;
      resolve(reachable);
    };
    const timer = setTimeout(() => finish(false), DATABASE_PREFLIGHT_TIMEOUT_MS);

    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
}

async function isDatabaseAvailable(rawUrl: string) {
  if (Date.now() < databaseOfflineUntil) return false;
  if (Date.now() < databaseOnlineUntil) return true;
  if (databaseHealthCheck) return databaseHealthCheck;

  databaseHealthCheck = (async () => {
    if (!(await canReachDatabase(rawUrl))) return false;

    try {
      await withTimeout(getPrismaClient().$queryRaw`SELECT 1`, DATABASE_READ_TIMEOUT_MS);
      databaseOnlineUntil = Date.now() + DATABASE_CIRCUIT_BREAKER_MS;
      return true;
    } catch {
      databaseOfflineUntil = Date.now() + DATABASE_CIRCUIT_BREAKER_MS;
      return false;
    }
  })().finally(() => {
    databaseHealthCheck = null;
  });

  return databaseHealthCheck;
}

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
    return buildSelectedLibraryRankPayload(buildDemoRankPayload(type));
  }

  const runtimeUrl = env.DATABASE_URL || env.DIRECT_URL;
  if (!runtimeUrl || !(await isDatabaseAvailable(runtimeUrl))) {
    return buildSelectedLibraryRankPayload(buildDemoRankPayload(type, DATABASE_FALLBACK_MESSAGE));
  }

  try {
    const payload = await withTimeout(getLatestRankPayload(type), DATABASE_READ_TIMEOUT_MS);

    if (type.startsWith("xhunt") && payload.items.length < KOL_MINIMUM_ITEMS) {
      return buildDemoRankPayload(type, "当前 KOL 抓取数据不足，页面正在展示本站精选 KOL 榜。");
    }

    return buildSelectedLibraryRankPayload(payload);
  } catch (error) {
    databaseOfflineUntil = Date.now() + DATABASE_CIRCUIT_BREAKER_MS;
    console.warn("[rank-data] Falling back to demo data:", error);
    return buildSelectedLibraryRankPayload(buildDemoRankPayload(type, DATABASE_FALLBACK_MESSAGE));
  }
}
