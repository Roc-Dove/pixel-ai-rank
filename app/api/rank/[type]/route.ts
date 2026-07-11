import { getRankPayload } from "@/lib/rank-data";
import { isRankRouteType } from "@/types/rank";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(_request: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;

  if (!isRankRouteType(type)) {
    return Response.json({ error: "未知榜单类型" }, { status: 404 });
  }

  const payload = await getRankPayload(type);
  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
