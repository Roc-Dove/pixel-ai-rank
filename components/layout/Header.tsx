"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LibraryBig, Moon, Radio, Search, Sun, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CommunityBanner } from "@/components/layout/CommunityBanner";
import { useSearch } from "@/components/providers/SearchProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { RankTypeIcon } from "@/components/rank/RankTypeIcon";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { PixelMark } from "@/components/ui/PixelMark";
import { isRankRouteType, TAB_CONFIG } from "@/types/rank";

export function Header() {
  const pathname = usePathname();
  const { search, setSearch } = useSearch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSearch("");
  }, [pathname, setSearch]);

  const currentType = useMemo(() => {
    const type = pathname.split("/")[2];
    return type && isRankRouteType(type) ? type : null;
  }, [pathname]);

  const currentTab = currentType ? TAB_CONFIG[currentType] : null;
  const isHome = pathname === "/";
  const isRank = pathname.startsWith("/rank/");
  const isLibrary = pathname.startsWith("/library");
  const isSignals = pathname.startsWith("/signals");
  const showSearch = Boolean(currentTab) || pathname === "/library" || pathname === "/signals";
  const searchLabel = currentTab ? `搜索${currentTab.shortLabel}` : isSignals ? "搜索最新 AI 情报" : "搜索 AI 工具库";

  return (
    <header className="pixel-topbar">
      <div className="pixel-header-shell">
        <div className="pixel-header-main">
          <Link href="/" className="pixel-brand" aria-label="Pixel AI Rank 首页">
            <PixelMark />
            <span className="pixel-brand-copy">
              <strong>PIXEL AI RANK</strong>
              <small>AI 信号导航站</small>
            </span>
          </Link>

          <nav className="pixel-site-nav" aria-label="主导航">
            <Link href="/" className={isHome ? "is-active" : ""} aria-current={isHome ? "page" : undefined}>
              总览
            </Link>
            <Link href="/signals" className={isSignals ? "is-active" : ""} aria-current={isSignals ? "page" : undefined}>
              情报
            </Link>
            <Link href="/rank/aicpb" className={isRank ? "is-active" : ""} aria-current={isRank ? "page" : undefined}>
              排行榜
            </Link>
            <Link href="/library" className={isLibrary ? "is-active" : ""} aria-current={isLibrary ? "page" : undefined}>
              工具库
            </Link>
          </nav>

          <div className="pixel-header-actions">
            <CommunityBanner />
            <PixelButton
              tone="ghost"
              className="pixel-icon-button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
              <span className="pixel-theme-label">{theme === "dark" ? "浅色" : "深色"}</span>
            </PixelButton>
          </div>
        </div>

        {showSearch ? (
          <div className="pixel-header-search-row">
            <div className="pixel-search-context">
              {currentType ? <RankTypeIcon type={currentType} /> : isSignals ? <Radio size={18} strokeWidth={1.8} aria-hidden="true" /> : <LibraryBig size={18} strokeWidth={1.8} aria-hidden="true" />}
              <span>{currentTab?.shortLabel ?? (isSignals ? "最新 AI 情报" : "AI 工具库")}</span>
              <span className="pixel-live-dot" aria-hidden="true" />
            </div>

            <div className="pixel-search-wrap">
              <Search className="pixel-search-icon" size={19} strokeWidth={1.8} aria-hidden="true" />
              <PixelInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={currentTab ? "搜索名称、简介或标签" : isSignals ? "搜索公司、发布、行动建议或标签" : "搜索工具、分类、人群或使用场景"}
                aria-label={searchLabel}
                autoComplete="off"
              />
              {search ? (
                <button type="button" className="pixel-search-clear" onClick={() => setSearch("")} aria-label="清空搜索">
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <div className="pixel-search-hint" aria-hidden="true">
              <BookOpen size={16} strokeWidth={1.8} />
              <span>{currentTab ? "在当前榜单内检索" : isSignals ? "官方信源 · 持续核验" : "精选工具 · 场景化导购"}</span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
