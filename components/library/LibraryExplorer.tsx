"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { LIBRARY_AUDIENCES, LIBRARY_CATEGORIES, type LibraryAudience, type LibraryCategory, type LibraryItemWithGuide } from "@/types/library";

const ALL_CATEGORIES = "全部";
const ALL_AUDIENCES = "全部人群";

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
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LibraryCard({ item }: { item: LibraryItemWithGuide }) {
  const logoUrl = getLogoUrl(item);

  return (
    <article className="pixel-library-card">
      <div className="flex min-w-0 items-start gap-3">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="pixel-logo" loading="lazy" />
        ) : (
          <span className="pixel-logo-fallback">{initials(item.name)}</span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="pixel-library-title">{item.name}</h2>
            <span className="pixel-library-category">{item.category}</span>
          </div>
          <p className="pixel-library-description">{item.descriptionZh}</p>
        </div>
      </div>

      <div className="pixel-library-guide-row" aria-label="导购信息">
        <span>推荐 {item.guide.recommendation}</span>
        <span>上手 {item.guide.difficulty}</span>
        <span>{item.guide.audiences[0]}</span>
      </div>

      <div className="pixel-library-tags">
        {[...item.tags, ...item.guide.useCases.slice(0, 1)].map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="pixel-library-actions">
        <Link href={`/library/${item.id}`} className={pixelButtonClassName({ tone: "ghost" })}>
          <span>详情</span>
        </Link>
        {item.officialUrl ? (
          <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })}>
            <span aria-hidden="true">↗</span>
            <span>访问官网</span>
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

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatched = activeCategory === ALL_CATEGORIES || item.category === activeCategory;
      if (!categoryMatched) return false;
      const audienceMatched = activeAudience === ALL_AUDIENCES || item.guide.audiences.includes(activeAudience);
      if (!audienceMatched) return false;

      if (!query) return true;

      const haystack = [item.name, item.category, item.descriptionZh, ...item.tags, ...item.guide.audiences, ...item.guide.useCases, ...item.guide.bestFor].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [activeAudience, activeCategory, items, search]);

  const categories = useMemo(
    () =>
      LIBRARY_CATEGORIES.map((category) => ({
        category,
        count: items.filter((item) => item.category === category).length,
      })),
    [items],
  );

  return (
    <main className="pixel-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="pixel-panel pixel-hero">
          <div className="pixel-library-hero">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="pixel-hero-eyebrow purple">
                  <span aria-hidden="true">🧰</span>
                  <span>AI LIBRARY</span>
                </span>
                <span className="pixel-chip blue">精选 / {items.length}</span>
                <span className="pixel-chip green">官网可访问</span>
              </div>
              <h1 className="pixel-hero-title">AI库</h1>
            </div>
            <p className="pixel-hero-summary">
              按用途和人群查找 AI 工具。当前版本精选自 AI Collection 的核心工具方向，已改写为中文导购内容，并只展示能确认官网入口的条目。
            </p>
          </div>
        </section>

        <section className="pixel-library-filters" aria-label="适合人群">
          <button className={pixelButtonClassName({ tone: "green", active: activeAudience === ALL_AUDIENCES })} onClick={() => setActiveAudience(ALL_AUDIENCES)}>
            全部人群
          </button>
          {LIBRARY_AUDIENCES.map((audience) => (
            <button
              key={audience}
              className={pixelButtonClassName({ tone: activeAudience === audience ? "green" : "ghost", active: activeAudience === audience })}
              onClick={() => setActiveAudience(audience)}
            >
              {audience}
            </button>
          ))}
        </section>

        <section className="pixel-library-filters" aria-label="AI 工具分类">
          <button className={pixelButtonClassName({ tone: "purple", active: activeCategory === ALL_CATEGORIES })} onClick={() => setActiveCategory(ALL_CATEGORIES)}>
            全部 / {items.length}
          </button>
          {categories.map(({ category, count }) => (
            <button
              key={category}
              className={pixelButtonClassName({ tone: activeCategory === category ? "blue" : "ghost", active: activeCategory === category })}
              onClick={() => setActiveCategory(category)}
            >
              {category} / {count}
            </button>
          ))}
        </section>

        {filteredItems.length > 0 ? (
          <section className="pixel-library-grid" aria-label="AI 工具列表">
            {filteredItems.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <section className="pixel-empty">
            <span className="pixel-loader-runner" aria-hidden="true">
              🔎
            </span>
            <div>
              <h2 className="m-0 text-xl font-bold">没有匹配结果</h2>
              <p className="pixel-muted mt-2">换一个关键词，或者切回全部分类再找找看。</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
