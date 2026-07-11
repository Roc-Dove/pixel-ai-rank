import { PrismaClient } from "@prisma/client";
import { getServerEnv } from "@/lib/env";

declare global {
  var __pixelPrisma__: PrismaClient | undefined;
}

function withRuntimeTimeouts(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "2");
    if (!url.searchParams.has("pool_timeout")) url.searchParams.set("pool_timeout", "2");
    if (!url.searchParams.has("socket_timeout")) url.searchParams.set("socket_timeout", "3");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function getPrismaClient() {
  const env = getServerEnv();
  const runtimeUrl = env.DATABASE_URL || env.DIRECT_URL;

  if (!runtimeUrl) {
    throw new Error("缺少 DATABASE_URL，请先在 .env.local 中配置数据库连接串。");
  }

  if (!global.__pixelPrisma__) {
    global.__pixelPrisma__ = new PrismaClient({
      datasourceUrl: withRuntimeTimeouts(runtimeUrl),
    });
  }

  return global.__pixelPrisma__;
}
