"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { isRankRouteType, TAB_CONFIG } from "@/types/rank";

export function Header() {
  const pathname = usePathname();
  const { search, setSearch } = useSearch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSearch("");
  }, [pathname, setSearch]);

  const currentTab = useMemo(() => {
    const type = pathname.split("/")[2];
    return type && isRankRouteType(type) ? TAB_CONFIG[type] : null;
  }, [pathname]);

  return (
    <header className="pixel-topbar">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/rank/aicpb" className="pixel-brand">
              <span className="pixel-brand-mark" aria-hidden="true">
                🍄
              </span>
              <span className="pixel-brand-copy">
                <span className="pixel-brand-title">PIXEL AI RANK</span>
                <span className="pixel-brand-subtitle">一个更清楚的 AI 产品与 KOL 榜单面板</span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              {currentTab ? (
                <div className={`pixel-chip ${currentTab.tone}`}>
                  <span aria-hidden="true">{currentTab.icon}</span>
                  <span>{currentTab.shortLabel}</span>
                </div>
              ) : null}
              <div className="pixel-chip">
                <span aria-hidden="true">⏱</span>
                <span>AUTO REFRESH / 48H</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:min-w-[420px] xl:justify-end">
            <div className="pixel-search-wrap min-w-[260px] flex-1">
              <div className="pixel-search-icon">
                <span aria-hidden="true">🔎</span>
              </div>
              <PixelInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索名称、简介或标签"
                aria-label="搜索当前榜单"
              />
            </div>

            <PixelButton tone="ghost" onClick={toggleTheme} aria-label="切换主题">
              <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
              <span>{theme === "dark" ? "DAY MODE" : "NIGHT MODE"}</span>
            </PixelButton>
          </div>
        </div>
      </div>
    </header>
  );
}
