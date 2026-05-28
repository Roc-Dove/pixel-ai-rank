import { PrismaClient } from "@prisma/client";
import { getServerEnv } from "@/lib/env";

declare global {
  var __pixelPrisma__: PrismaClient | undefined;
}

export function getPrismaClient() {
  const env = getServerEnv();
  const runtimeUrl = env.DATABASE_URL || env.DIRECT_URL;

  if (!runtimeUrl) {
    throw new Error("缺少 DATABASE_URL，请先在 .env.local 中配置数据库连接串。");
  }

  if (!global.__pixelPrisma__) {
    global.__pixelPrisma__ = new PrismaClient({
      datasourceUrl: runtimeUrl,
    });
  }

  return global.__pixelPrisma__;
}
