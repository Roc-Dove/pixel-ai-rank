"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Gauge, LibraryBig, RotateCcw, SearchX, SlidersHorizontal, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";
import { LIBRARY_AUDIENCES, LIBRARY_CATEGORIES, type LibraryAudience, type LibraryCategory, type LibraryItemWithGuide } from "@/types/library";

const ALL_CATEGORIES = "全部";
const ALL_AUDIENCES = "全部人群";
const PAGE_SIZE = 12;
type LibrarySort = "recommendation" | "easy" | "name";

function getLogoUrl(item: LibraryItemWithGuide) {
  if (!item.officialUrl) return null;
  try {
    const url = new URL(item.officialUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function difficultyTone(difficulty: LibraryItemWithGuide["guide"]["difficulty"]) {
  if (difficulty === "低") return "easy";
  if (difficulty === "中") return "medium";
  return "hard";
}

function LibraryCard({ item }: { item: LibraryItemWithGuide }) {
  const logoUrl = getLogoUrl(item);

  return (
    <article className="pixel-library-card">
      <div className="pixel-library-card-head">
        {logoUrl ? (
          <Image src={logoUrl} alt="" className="pixel-logo" width={50} height={50} sizes="50px" unoptimized />
        ) : (
          <span className="pixel-logo-fallback" aria-hidden="true">{initials(item.name)}</span>
        )}

        <div>
          <span className="pixel-library-category">{item.category}</span>
          <h2><Link href={`/library/${item.id}`}>{item.name}</Link></h2>
        </div>
      </div>

      <p className="pixel-library-description">{item.descriptionZh}</p>

      <div className="pixel-library-score">
        <div className="pixel-library-score-head">
          <span>推荐指数</span><strong>{item.guide.recommendation}</strong>
        </div>
        <div
          className="pixel-library-score-track"
          role="progressbar"
          aria-label={`${item.name} 推荐指数`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={item.guide.recommendation}
        >
          <span style={{ width: `${item.guide.recommendation}%` }} />
        </div>
      </div>

      <div className="pixel-library-meta-line">
        <span className={`pixel-library-difficulty ${difficultyTone(item.guide.difficulty)}`}><Gauge size={14} aria-hidden="true" /> 上手 {item.guide.difficulty}</span>
        {item.guide.audiences.slice(0, 2).map((audience) => <span key={audience}>{audience}</span>)}
      </div>

      <div className="pixel-library-tags">
        {[...item.tags, ...item.guide.useCases.slice(0, 1)].slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <div className="pixel-library-actions">
        <Link href={`/library/${item.id}`} className={pixelButtonClassName({ tone: "ghost" })}>查看详情</Link>
        {item.officialUrl ? (
          <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })} aria-label={`访问 ${item.name} 官网`}>
            官网 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function LibraryExplorer({ items }: { items: LibraryItemWithGuide[] }) {
  const { search } = useSearch();
  const [activeCategory, setActiveCategory] = useState<LibraryCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [activeAudience, setActiveAudience] = useState<LibraryAudience | typeof ALL_AUDIENCES>(ALL_AUDIENCES);
  const [sortMode, setSortMode] = useState<LibrarySort>("recommendation");
  const [pagination, setPagination] = useState({ key: "", limit: PAGE_SIZE });

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (activeCategory !== ALL_CATEGORIES && item.category !== activeCategory) return false;
      if (activeAudience !== ALL_AUDIENCES && !item.guide.audiences.includes(activeAudience)) return false;
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
  }, [activeAudience, activeCategory, items, search, sortMode]);

  const categories = useMemo(() => LIBRARY_CATEGORIES.map((category) => ({ category, count: items.filter((item) => item.category === category).length })), [items]);
  const filterKey = `${activeCategory}:${activeAudience}:${sortMode}:${search.trim().toLowerCase()}`;
  const visibleLimit = pagination.key === filterKey ? pagination.limit : PAGE_SIZE;
  const visibleItems = filteredItems.slice(0, visibleLimit);
  const hasMore = visibleItems.length < filteredItems.length;
  const hasFilters = activeCategory !== ALL_CATEGORIES || activeAudience !== ALL_AUDIENCES;

  const resetFilters = () => {
    setActiveCategory(ALL_CATEGORIES);
    setActiveAudience(ALL_AUDIENCES);
  };

  return (
    <main id="main-content" className="pixel-shell">
      <div className="pixel-content-stack">
        <section className="pixel-library-hero">
          <div>
            <span className="pixel-kicker"><LibraryBig size={16} aria-hidden="true" /> CURATED AI LIBRARY</span>
            <h1>AI 工具库</h1>
            <p>从“这个工具是什么”继续追问到“它适不适合我”。按用途、人群和上手难度查找可访问的 AI 工具。</p>
          </div>
          <dl>
            <div><dt>精选工具</dt><dd>{items.length}</dd></div>
            <div><dt>实用分类</dt><dd>{LIBRARY_CATEGORIES.length}</dd></div>
            <div><dt>筛选维度</dt><dd>4</dd></div>
          </dl>
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
        </section>

        <div className="pixel-library-toolbar">
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
