"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { RankTable } from "@/components/rank/RankTable";
import { formatUpdatedAt } from "@/lib/utils/formatNumber";
import { RANK_TYPES, TAB_CONFIG, type RankPayload } from "@/types/rank";

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
  const updatedLabel = payload.lastUpdated ? formatUpdatedAt(payload.lastUpdated) : "WAITING";

  return (
    <main className="pixel-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="pixel-overview-grid">
          <section className="pixel-panel pixel-overview-main pixel-hero">
            <div className="pixel-hero-main">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`pixel-hero-eyebrow ${source.tone}`}>
                    <span aria-hidden="true">{source.icon}</span>
                    <span>{source.label}</span>
                  </span>
                  <span className="pixel-chip blue">UPDATED / {updatedLabel}</span>
                </div>
                <h1 className="pixel-hero-title">{source.shortLabel}</h1>
              </div>

              <div className="space-y-3">
              <p className="pixel-hero-summary">{source.summary}</p>
                <div className="pixel-hero-meta">
                  <span className="pixel-chip purple">MATCH / {filteredItems.length}</span>
                  <span className="pixel-chip yellow">TOTAL / {payload.totalItems}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <nav className="pixel-nav" aria-label="榜单导航">
          {RANK_TYPES.map((type) => {
            const config = TAB_CONFIG[type];
            const active = payload.type === type;

            return (
              <Link key={type} href={`/rank/${type}`} className={`pixel-nav-card ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <span className={`pixel-chip ${active ? config.tone : "blue"}`}>
                  <span aria-hidden="true">{config.icon}</span>
                  <span>{config.navLabel}</span>
                </span>
                <span className="pixel-nav-card-label">{config.label}</span>
              </Link>
            );
          })}
        </nav>

        <div key={payload.type} className="transition-all duration-200">
          <RankTable key={`${payload.type}:${search}`} payload={payload} items={filteredItems} searchQuery={search} onRetry={() => window.location.reload()} />
        </div>
      </div>
    </main>
  );
}
