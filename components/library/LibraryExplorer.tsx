"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Gauge, LibraryBig, RotateCcw, SearchX, SlidersHorizontal, Users } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";
import { LIBRARY_AUDIENCES, LIBRARY_CATEGORIES, type LibraryAudience, type LibraryCardItem, type LibraryCategory } from "@/types/library";

const ALL_CATEGORIES = "全部";
const ALL_AUDIENCES = "全部人群";
const ALL_SOURCES = "全部来源";
const PAGE_SIZE = 12;
type LibrarySort = "recommendation" | "easy" | "name";
type LibrarySourceFilter = typeof ALL_SOURCES | LibraryCardItem["sourceTier"];

function difficultyTone(difficulty: LibraryCardItem["guide"]["difficulty"]) {
  if (difficulty === "低") return "easy";
  if (difficulty === "中") return "medium";
  return "hard";
}

function LibraryCard({ item }: { item: LibraryCardItem }) {
  return (
    <article className="pixel-library-card">
      <div className="pixel-library-card-visual">
        <span className="pixel-library-logo-plate">
          <LibraryLogo name={item.name} officialUrl={item.officialUrl} />
        </span>
        <span className="pixel-library-category">{item.category}</span>
        <div
          className="pixel-library-score-ring"
          style={{ "--library-score": `${item.guide.recommendation * 3.6}deg` } as CSSProperties}
          role="img"
          aria-label={`${item.name} 推荐指数 ${item.guide.recommendation}`}
        >
          <strong>{item.guide.recommendation}</strong>
          <small>推荐</small>
        </div>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </div>

      <div className="pixel-library-card-head">
        <div>
          <div className="pixel-library-card-labels">
            <span className={`pixel-library-source is-${item.sourceTier}`}>
              {item.sourceTier === "official" ? `官方核验${item.verifiedAt ? ` ${item.verifiedAt.slice(5).replace("-", ".")}` : ""}` : "聚合资料"}
            </span>
          </div>
          <h2><Link href={`/library/${item.id}`} prefetch={false}>{item.name}</Link></h2>
        </div>
      </div>

      <p className="pixel-library-description">{item.descriptionZh}</p>

      <div className="pixel-library-meta-line">
        <span className={`pixel-library-difficulty ${difficultyTone(item.guide.difficulty)}`}><Gauge size={14} aria-hidden="true" /> 上手 {item.guide.difficulty}</span>
        <span>{item.guide.audiences[0]}</span>
        <span>{item.guideDepth === "individual" ? "个体导购" : "分类基线"}</span>
      </div>

      <div className="pixel-library-tags">
        {item.guide.useCases.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <div className="pixel-library-actions">
        <Link href={`/library/${item.id}`} prefetch={false} className={pixelButtonClassName({ tone: "blue" })}>查看详情</Link>
        {item.officialUrl ? (
          <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "ghost" })} aria-label={`访问 ${item.name} 官网`}>
            官网 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function LibraryExplorer({ items }: { items: LibraryCardItem[] }) {
  const { search } = useSearch();
  const [activeCategory, setActiveCategory] = useState<LibraryCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [activeAudience, setActiveAudience] = useState<LibraryAudience | typeof ALL_AUDIENCES>(ALL_AUDIENCES);
  const [activeSource, setActiveSource] = useState<LibrarySourceFilter>(ALL_SOURCES);
  const [sortMode, setSortMode] = useState<LibrarySort>("recommendation");
  const [pagination, setPagination] = useState({ key: "", limit: PAGE_SIZE });

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (activeCategory !== ALL_CATEGORIES && item.category !== activeCategory) return false;
      if (activeAudience !== ALL_AUDIENCES && !item.guide.audiences.includes(activeAudience)) return false;
      if (activeSource !== ALL_SOURCES && item.sourceTier !== activeSource) return false;
      if (!query) return true;

      const haystack = [item.name, item.category, item.descriptionZh, ...item.tags, ...item.guide.audiences, ...item.guide.useCases, ...item.guide.bestFor].join(" ").toLowerCase();
      return haystack.includes(query);
    });

    return filtered.sort((left, right) => {
      if (sortMode === "name") return left.name.localeCompare(right.name);
      if (sortMode === "easy") {
        const difficulty = { 低: 0, 中: 1, 高: 2 };
        return difficulty[left.guide.difficulty] - difficulty[right.guide.difficulty] || right.guide.recommendation - left.guide.recommendation;
      }
      return right.guide.recommendation - left.guide.recommendation || left.name.localeCompare(right.name);
    });
  }, [activeAudience, activeCategory, activeSource, items, search, sortMode]);

  const categories = useMemo(() => LIBRARY_CATEGORIES.map((category) => ({ category, count: items.filter((item) => item.category === category).length })), [items]);
  const visualCategories = useMemo(() => [...categories].sort((left, right) => right.count - left.count).slice(0, 6), [categories]);
  const maxVisualCategoryCount = Math.max(...visualCategories.map((item) => item.count), 1);
  const officialCount = useMemo(() => items.filter((item) => item.sourceTier === "official").length, [items]);
  const individualGuideCount = useMemo(() => items.filter((item) => item.guideDepth === "individual").length, [items]);
  const filterKey = `${activeCategory}:${activeAudience}:${activeSource}:${sortMode}:${search.trim().toLowerCase()}`;
  const visibleLimit = pagination.key === filterKey ? pagination.limit : PAGE_SIZE;
  const visibleItems = filteredItems.slice(0, visibleLimit);
  const hasMore = visibleItems.length < filteredItems.length;
  const hasFilters = activeCategory !== ALL_CATEGORIES || activeAudience !== ALL_AUDIENCES || activeSource !== ALL_SOURCES;

  const resetFilters = () => {
    setActiveCategory(ALL_CATEGORIES);
    setActiveAudience(ALL_AUDIENCES);
    setActiveSource(ALL_SOURCES);
  };

  return (
    <main id="main-content" className="pixel-shell" tabIndex={-1}>
      <div className="pixel-content-stack">
        <section className="pixel-library-hero">
          <div>
            <span className="pixel-kicker"><LibraryBig size={16} aria-hidden="true" /> CURATED AI LIBRARY</span>
            <h1>AI 工具库</h1>
            <p>按场景、人群和上手难度筛选；完整判断留在工具详情里。</p>
          </div>
          <figure className="pixel-library-category-map" aria-label={`${items.length} 个工具的热门分类分布`}>
            <header>
              <div><strong>{items.length}</strong><span>精选工具</span></div>
              <small>{LIBRARY_CATEGORIES.length} 个分类</small>
            </header>
            <div>
              {visualCategories.map(({ category, count }) => (
                <button
                  type="button"
                  key={category}
                  className={activeCategory === category ? "is-active" : ""}
                  aria-label={`筛选 ${category}，${count} 个工具`}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  <span>{category}</span>
                  <i aria-hidden="true"><b style={{ width: `${(count / maxVisualCategoryCount) * 100}%` }} /></i>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
            <figcaption><span>{officialCount} 个官方核验</span><span>{individualGuideCount} 个个体导购</span></figcaption>
          </figure>
        </section>

        <section className="pixel-filter-panel" aria-labelledby="library-filter-title">
          <div className="pixel-filter-heading">
            <div><SlidersHorizontal size={18} aria-hidden="true" /><h2 id="library-filter-title">快速筛选</h2></div>
            {hasFilters ? <button type="button" onClick={resetFilters}><RotateCcw size={15} aria-hidden="true" /> 重置</button> : null}
          </div>

          <div className="pixel-filter-row">
            <span className="pixel-filter-label"><Users size={15} aria-hidden="true" /> 适合人群</span>
            <div className="pixel-filter-options">
              <button className={pixelButtonClassName({ tone: activeAudience === ALL_AUDIENCES ? "blue" : "ghost", active: activeAudience === ALL_AUDIENCES })} aria-pressed={activeAudience === ALL_AUDIENCES} onClick={() => setActiveAudience(ALL_AUDIENCES)}>全部人群</button>
              {LIBRARY_AUDIENCES.map((audience) => (
                <button key={audience} className={pixelButtonClassName({ tone: activeAudience === audience ? "blue" : "ghost", active: activeAudience === audience })} aria-pressed={activeAudience === audience} onClick={() => setActiveAudience(audience)}>{audience}</button>
              ))}
            </div>
          </div>

          <div className="pixel-filter-row">
            <span className="pixel-filter-label"><LibraryBig size={15} aria-hidden="true" /> 工具分类</span>
            <div className="pixel-filter-options">
              <button className={pixelButtonClassName({ tone: activeCategory === ALL_CATEGORIES ? "purple" : "ghost", active: activeCategory === ALL_CATEGORIES })} aria-pressed={activeCategory === ALL_CATEGORIES} onClick={() => setActiveCategory(ALL_CATEGORIES)}>全部 / {items.length}</button>
              {categories.map(({ category, count }) => (
                <button key={category} className={pixelButtonClassName({ tone: activeCategory === category ? "purple" : "ghost", active: activeCategory === category })} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category} / {count}</button>
              ))}
            </div>
          </div>

          <div className="pixel-filter-row">
            <span className="pixel-filter-label">资料状态</span>
            <div className="pixel-filter-options">
              <button className={pixelButtonClassName({ tone: activeSource === ALL_SOURCES ? "green" : "ghost", active: activeSource === ALL_SOURCES })} aria-pressed={activeSource === ALL_SOURCES} onClick={() => setActiveSource(ALL_SOURCES)}>全部来源</button>
              <button className={pixelButtonClassName({ tone: activeSource === "official" ? "green" : "ghost", active: activeSource === "official" })} aria-pressed={activeSource === "official"} onClick={() => setActiveSource("official")}>官方核验 / {officialCount}</button>
              <button className={pixelButtonClassName({ tone: activeSource === "community" ? "green" : "ghost", active: activeSource === "community" })} aria-pressed={activeSource === "community"} onClick={() => setActiveSource("community")}>聚合资料 / {items.length - officialCount}</button>
            </div>
          </div>
        </section>

        <div className="pixel-library-toolbar" aria-live="polite">
          <div><strong>{filteredItems.length}</strong><span> 个匹配工具</span>{search ? <small>关键词：{search}</small> : null}</div>
          <label>
            <span>排序</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as LibrarySort)}>
              <option value="recommendation">推荐优先</option>
              <option value="easy">更易上手</option>
              <option value="name">名称 A–Z</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </label>
        </div>

        {filteredItems.length > 0 ? (
          <>
            <section className="pixel-library-grid" aria-label="AI 工具列表">
              {visibleItems.map((item) => <LibraryCard key={item.id} item={item} />)}
            </section>
            {hasMore ? (
              <div className="pixel-load-more">
                <p>已显示 {visibleItems.length} / {filteredItems.length}</p>
                <PixelButton tone="ghost" onClick={() => setPagination({ key: filterKey, limit: visibleLimit + PAGE_SIZE })}>加载更多工具</PixelButton>
              </div>
            ) : null}
          </>
        ) : (
          <section className="pixel-empty">
            <SearchX size={26} aria-hidden="true" />
            <div><h2>没有匹配结果</h2><p>换一个关键词，或者重置人群和分类条件。</p></div>
            {hasFilters ? <PixelButton tone="blue" onClick={resetFilters}>重置筛选</PixelButton> : null}
          </section>
        )}
      </div>
    </main>
  );
}
