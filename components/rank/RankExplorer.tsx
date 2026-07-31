"use client";

import Link from "next/link";
import { Info, Layers3, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { RankTable } from "@/components/rank/RankTable";
import { RankTypeIcon } from "@/components/rank/RankTypeIcon";
import { formatUpdatedAt } from "@/lib/utils/formatNumber";
import { RANK_TYPES, TAB_CONFIG, type RankPayload } from "@/types/rank";

const MODE_COPY: Record<RankPayload["dataMode"], { label: string; description: string }> = {
  database: { label: "真实抓取", description: "来自外部数据源的最近一次成功抓取" },
  curated: { label: "本站精选", description: "基于产品库字段与场景适配计算" },
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
  const topThree = [...payload.items].sort((left, right) => left.rank - right.rank).slice(0, 3);

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

          <figure className="pixel-rank-podium" aria-label={`当前榜单前三：${topThree.map((item) => `第 ${item.rank} 名 ${item.name}`).join("，")}`}>
            <header><span><Trophy size={16} aria-hidden="true" /> CURRENT TOP 3</span><small>{mode.label}</small></header>
            <div>
              {topThree.map((item) => (
                <div key={`${item.rank}-${item.name}`} className={`is-rank-${item.rank}`}>
                  <span>{item.name.trim().charAt(0).toUpperCase()}</span>
                  <strong>{item.name}</strong>
                  <small>{item.metricPrimary ?? "—"}</small>
                  <i><b>{item.rank}</b></i>
                </div>
              ))}
            </div>
            <figcaption>
              <span><strong>{filteredItems.length}</strong> 当前结果</span>
              <span><strong>{mode.label}</strong> 数据模式</span>
              <span><strong>{updatedLabel}</strong> 最近更新</span>
            </figcaption>
          </figure>
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
          <details className="pixel-source-details">
            <summary><Info size={17} strokeWidth={1.8} aria-hidden="true" /><strong>数据口径</strong><span>{payload.sourceLabel}</span></summary>
            <div><p>{payload.message}</p><span><Layers3 size={15} aria-hidden="true" /> {payload.sourceLabel}</span></div>
          </details>
        ) : null}

        <RankTable key={`${payload.type}:${search}`} payload={payload} items={filteredItems} searchQuery={search} onRetry={() => window.location.reload()} />
      </div>
    </main>
  );
}
