"use client";

import Link from "next/link";
import { Clock3, Database, Info, Layers3, ListFilter } from "lucide-react";
import { useMemo } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { RankTable } from "@/components/rank/RankTable";
import { RankTypeIcon } from "@/components/rank/RankTypeIcon";
import { formatUpdatedAt } from "@/lib/utils/formatNumber";
import { RANK_TYPES, TAB_CONFIG, type RankPayload } from "@/types/rank";

const MODE_COPY: Record<RankPayload["dataMode"], { label: string; description: string }> = {
  database: { label: "真实抓取", description: "来自外部数据源的最近一次成功抓取" },
  curated: { label: "本站精选", description: "基于工具库字段与场景适配计算" },
  demo: { label: "降级数据", description: "数据源不可用时的内置可浏览版本" },
};

const STATUS_COPY: Record<RankPayload["sourceStatus"], string> = {
  ready: "数据可用",
  stale: "数据已过期",
  degraded: "降级展示",
  empty: "等待数据",
};

export function RankExplorer({ payload }: { payload: RankPayload }) {
  const { search } = useSearch();

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return payload.items;

    return payload.items.filter((item) => {
      const haystack = [item.name, item.description, item.metricTertiary].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [payload.items, search]);

  const source = TAB_CONFIG[payload.type];
  const mode = MODE_COPY[payload.dataMode];
  const modeDescription = payload.sourceStatus === "stale"
    ? "来自外部数据源的历史抓取"
    : mode.description;
  const statusClassName = payload.sourceStatus === "stale"
    ? "is-degraded"
    : `is-${payload.sourceStatus}`;
  const updatedLabel = payload.dataMode === "curated"
    ? "版本化维护"
    : payload.lastUpdated
      ? formatUpdatedAt(payload.lastUpdated)
      : "尚未更新";

  return (
    <main id="main-content" className="pixel-shell" tabIndex={-1}>
      <div className="pixel-content-stack">
        <section className={`pixel-rank-hero tone-${source.tone}`}>
          <div className="pixel-rank-hero-copy">
            <div className="pixel-rank-eyebrow">
              <RankTypeIcon type={payload.type} />
              <span>{source.label}</span>
            </div>
            <h1>{source.shortLabel}</h1>
            <p>{source.summary}</p>
            <div className="pixel-rank-status-line">
              <span className={`pixel-source-status ${statusClassName}`}>
                <span aria-hidden="true" /> {STATUS_COPY[payload.sourceStatus]}
              </span>
              <span>{modeDescription} · {payload.sourceLabel}</span>
            </div>
          </div>

          <dl className="pixel-rank-facts">
            <div>
              <dt><ListFilter size={16} aria-hidden="true" /> 当前结果</dt>
              <dd>{filteredItems.length}<small> / {payload.totalItems}</small></dd>
            </div>
            <div>
              <dt><Database size={16} aria-hidden="true" /> 数据模式</dt>
              <dd className="is-text">{mode.label}</dd>
            </div>
            <div>
              <dt><Clock3 size={16} aria-hidden="true" /> 最近更新</dt>
              <dd className="is-text">{updatedLabel}</dd>
            </div>
          </dl>
        </section>

        <nav className="pixel-rank-nav" aria-label="榜单导航">
          {RANK_TYPES.map((type, index) => {
            const config = TAB_CONFIG[type];
            const active = payload.type === type;

            return (
              <Link key={type} href={`/rank/${type}`} className={`pixel-rank-nav-card tone-${config.tone} ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <span className="pixel-rank-nav-icon"><RankTypeIcon type={type} /></span>
                <span className="pixel-rank-nav-copy">
                  <strong>{config.navLabel}</strong>
                  <small>{config.label}</small>
                </span>
                <span className="pixel-rank-nav-index">0{index + 1}</span>
              </Link>
            );
          })}
        </nav>

        {payload.message ? (
          <aside className="pixel-source-note" aria-label="数据口径说明">
            <Info size={18} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <strong>数据口径</strong>
              <p>{payload.message}</p>
            </div>
            <span><Layers3 size={15} aria-hidden="true" /> {payload.sourceLabel}</span>
          </aside>
        ) : null}

        <RankTable key={`${payload.type}:${search}`} payload={payload} items={filteredItems} searchQuery={search} onRetry={() => window.location.reload()} />
      </div>
    </main>
  );
}
