import type { CSSProperties } from "react";
import { Activity } from "lucide-react";
import { formatSignalImpact } from "@/lib/signals/utils";
import { SIGNAL_IMPACTS, type SignalCategory, type SignalImpact } from "@/types/signal";

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
  const [primaryImpact, secondaryImpact, tertiaryImpact] = SIGNAL_IMPACTS;
  const primaryCount = impactCounts[primaryImpact];
  const secondaryCount = impactCounts[secondaryImpact];
  const tertiaryCount = impactCounts[tertiaryImpact];
  const primaryEnd = total ? (primaryCount / total) * 100 : 0;
  const secondaryEnd = total ? ((primaryCount + secondaryCount) / total) * 100 : 0;
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count), 1);
  const chartStyle = {
    "--urgent-end": `${primaryEnd}%`,
    "--focus-end": `${secondaryEnd}%`,
  } as CSSProperties;

  return (
    <figure
      className={`pixel-signal-pulse ${compact ? "is-compact" : ""}`}
      aria-label={`共 ${total} 条来源观察：${formatSignalImpact(primaryImpact)} ${primaryCount} 条，${formatSignalImpact(secondaryImpact)} ${secondaryCount} 条，${formatSignalImpact(tertiaryImpact)} ${tertiaryCount} 条，覆盖 ${companies} 个来源主体。`}
    >
      <div className="pixel-signal-pulse-head">
        <span><Activity size={15} aria-hidden="true" /> SIGNAL MAP</span>
        <small>{companies} SOURCES</small>
      </div>

      <div className="pixel-signal-pulse-body">
        <div className="pixel-signal-donut" style={chartStyle} role="img" aria-label="观察类型分布">
          <div>
            <strong>{total}</strong>
            <span>本期观察</span>
          </div>
        </div>

        <ul className="pixel-signal-category-bars" aria-label="观察主题分布">
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
        <span className="is-urgent"><i aria-hidden="true" /> {formatSignalImpact(primaryImpact)} <strong>{primaryCount}</strong></span>
        <span className="is-focus"><i aria-hidden="true" /> {formatSignalImpact(secondaryImpact)} <strong>{secondaryCount}</strong></span>
        <span className="is-watch"><i aria-hidden="true" /> {formatSignalImpact(tertiaryImpact)} <strong>{tertiaryCount}</strong></span>
      </figcaption>
    </figure>
  );
}
