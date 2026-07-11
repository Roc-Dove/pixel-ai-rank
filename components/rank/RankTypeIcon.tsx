import { CalendarRange, Globe2, RadioTower, Rocket, Sparkles } from "lucide-react";
import type { RankRouteType } from "@/types/rank";

const ICONS = {
  aicpb: Rocket,
  stars: Sparkles,
  month: CalendarRange,
  xhunt_cn: RadioTower,
  xhunt_global: Globe2,
} satisfies Record<RankRouteType, typeof Rocket>;

export function RankTypeIcon({ type, size = 18 }: { type: RankRouteType; size?: number }) {
  const Icon = ICONS[type];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
