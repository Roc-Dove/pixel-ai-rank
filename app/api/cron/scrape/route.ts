import { getServerEnv } from "@/lib/env";
import { runAllScrapers } from "@/lib/scrapers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const env = getServerEnv();
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.DATABASE_URL) {
    return Response.json(
      {
        error: "缺少 DATABASE_URL，暂时无法执行正式抓取。",
        hint: "先在 .env.local 中配置数据库连接串，再访问该接口。",
      },
      { status: 503 },
    );
  }

  try {
    const results = await runAllScrapers();
    return Response.json({ results });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "抓取执行失败",
      },
      { status: 500 },
    );
  }
}
