import { getRankPayload } from "@/lib/rank-data";
import { isRankRouteType } from "@/types/rank";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;

  if (!isRankRouteType(type)) {
    return Response.json({ error: "未知榜单类型" }, { status: 404 });
  }

  const payload = await getRankPayload(type);
  return Response.json(payload);
}
