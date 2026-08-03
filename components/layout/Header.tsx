"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Globe2, LibraryBig, Moon, Rocket, Rss, Search, Sun, UsersRound, X } from "lucide-react";
import { useEffect, useMemo } from "react";
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
  const isLibrary = pathname.startsWith("/library");
  const isSignals = pathname.startsWith("/signals");
  const isProductRank = currentType === "aicpb" || currentType === "stars" || currentType === "month";
  const isGlobalProducts = currentType === "aicpb";
  const isKolRank = currentType === "xhunt_cn" || currentType === "xhunt_global";
  const showSearch = Boolean(currentTab) || pathname === "/library" || pathname === "/signals";
  const searchLabel = currentTab ? `搜索${currentTab.shortLabel}` : isSignals ? "搜索出海观察" : "搜索 AI 产品库";

  return (
    <header className="pixel-topbar">
      <div className="pixel-header-shell">
        <div className="pixel-header-main">
          <Link href="/" className="pixel-brand" aria-label="Pixel AI Rank 首页">
            <PixelMark />
            <span className="pixel-brand-copy">
              <strong>PIXEL AI RANK</strong>
              <small>产品 · KOL · 出海</small>
            </span>
          </Link>

          <nav className="pixel-site-nav" aria-label="主导航">
            <Link href="/rank/aicpb" className={isProductRank ? "is-active" : ""} aria-current={isProductRank ? "page" : undefined}>
              <Rocket size={18} aria-hidden="true" /><span>出海产品</span>
            </Link>
            <Link href="/library" className={isLibrary ? "is-active" : ""} aria-current={isLibrary ? "page" : undefined}>
              <LibraryBig size={18} aria-hidden="true" /><span>产品库</span>
            </Link>
            <Link href="/rank/xhunt_cn" className={isKolRank ? "is-active" : ""} aria-current={isKolRank ? "page" : undefined}>
              <UsersRound size={18} aria-hidden="true" /><span>KOL</span>
            </Link>
            <Link href="/signals" className={isSignals ? "is-active" : ""} aria-current={isSignals ? "page" : undefined}>
              <Globe2 size={18} aria-hidden="true" /><span>出海观察</span>
            </Link>
          </nav>

          <div className="pixel-header-actions">
            <a className="pixel-subscribe-link" href="/feed.xml" aria-label="订阅 Pixel AI Rank RSS">
              <Rss size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>订阅</span>
            </a>
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
              {currentType ? <RankTypeIcon type={currentType} /> : isSignals ? <Globe2 size={18} strokeWidth={1.8} aria-hidden="true" /> : <LibraryBig size={18} strokeWidth={1.8} aria-hidden="true" />}
              <span>{currentTab?.shortLabel ?? (isSignals ? "出海观察" : "AI 产品库")}</span>
              <span className="pixel-live-dot" aria-hidden="true" />
            </div>

            <div className="pixel-search-wrap">
              <Search className="pixel-search-icon" size={19} strokeWidth={1.8} aria-hidden="true" />
              <PixelInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={isGlobalProducts ? "搜索产品、场景、创始人或收费模式" : currentTab ? "搜索名称、简介或标签" : isSignals ? "搜索市场、平台、产品或渠道" : "搜索产品、分类、人群或使用场景"}
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
              <span>{isGlobalProducts ? "在国际化产品内检索" : currentTab ? "在当前榜单内检索" : isSignals ? "原始来源 · 持续核验" : "产品资料 · 场景筛选"}</span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
