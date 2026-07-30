import type { CSSProperties } from "react";
import { Activity } from "lucide-react";
import type { SignalCategory, SignalImpact } from "@/types/signal";

type SignalPulseProps = {
  total: number;
  companies: number;
  impactCounts: Record<SignalImpact, number>;
  categoryCounts: Array<{ category: SignalCategory; count: number }>;
  compact?: boolean;
};

export function SignalPulse({
  total,
  companies,
  impactCounts,
  categoryCounts,
  compact = false,
}: SignalPulseProps) {
  const urgent = impactCounts["立即行动"];
  const focus = impactCounts["重点关注"];
  const watch = impactCounts["持续观察"];
  const urgentEnd = total ? (urgent / total) * 100 : 0;
  const focusEnd = total ? ((urgent + focus) / total) * 100 : 0;
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count), 1);
  const chartStyle = {
    "--urgent-end": `${urgentEnd}%`,
    "--focus-end": `${focusEnd}%`,
  } as CSSProperties;

  return (
    <figure
      className={`pixel-signal-pulse ${compact ? "is-compact" : ""}`}
      aria-label={`共 ${total} 条官方情报：立即行动 ${urgent} 条，重点关注 ${focus} 条，持续观察 ${watch} 条，覆盖 ${companies} 家公司。`}
    >
      <div className="pixel-signal-pulse-head">
        <span><Activity size={15} aria-hidden="true" /> SIGNAL MAP</span>
        <small>{companies} COMPANIES</small>
      </div>

      <div className="pixel-signal-pulse-body">
        <div className="pixel-signal-donut" style={chartStyle} role="img" aria-label="情报优先级分布">
          <div>
            <strong>{total}</strong>
            <span>本期信号</span>
          </div>
        </div>

        <ul className="pixel-signal-category-bars" aria-label="情报主题分布">
          {categoryCounts.map(({ category, count }) => (
            <li key={category}>
              <span>{category}</span>
              <div aria-hidden="true">
                <i style={{ "--bar-width": `${(count / maxCategoryCount) * 100}%` } as CSSProperties} />
              </div>
              <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="pixel-signal-pulse-legend">
        <span className="is-urgent"><i aria-hidden="true" /> 立即行动 <strong>{urgent}</strong></span>
        <span className="is-focus"><i aria-hidden="true" /> 重点关注 <strong>{focus}</strong></span>
        <span className="is-watch"><i aria-hidden="true" /> 持续观察 <strong>{watch}</strong></span>
      </figcaption>
    </figure>
  );
}
