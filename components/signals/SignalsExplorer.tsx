"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Filter, RotateCcw, SearchX, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";
import { formatSignalDate } from "@/lib/signals/items";
import { SIGNAL_CATEGORIES, SIGNAL_IMPACTS, type SignalCategory, type SignalImpact, type SignalItem } from "@/types/signal";

const ALL_CATEGORIES = "全部";
const ALL_IMPACTS = "全部级别";

function impactClassName(impact: SignalImpact) {
  if (impact === "立即行动") return "urgent";
  if (impact === "重点关注") return "focus";
  return "watch";
}

function SignalCard({ item }: { item: SignalItem }) {
  return (
    <article className={`pixel-news-card tone-${impactClassName(item.impact)}`}>
      <div className="pixel-news-card-meta">
        <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
        <span>{item.company}</span>
        <span>{item.category}</span>
        <strong>{item.impact}</strong>
      </div>

      <div className="pixel-news-card-copy">
        <h2><Link href={`/signals/${item.id}`}>{item.title}</Link></h2>
        <p>{item.summary}</p>
      </div>

      <div className="pixel-news-takeaway">
        <span>WHY IT MATTERS</span>
        <p>{item.whyItMatters}</p>
      </div>

      <div className="pixel-news-tags" aria-label="相关标签">
        {item.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <div className="pixel-news-card-actions">
        <Link href={`/signals/${item.id}`} className={pixelButtonClassName({ tone: "ghost" })}>
          查看行动建议 <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="pixel-official-link">
          官方原文 <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function SignalsExplorer({ items }: { items: SignalItem[] }) {
  const { search } = useSearch();
  const [category, setCategory] = useState<SignalCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [impact, setImpact] = useState<SignalImpact | typeof ALL_IMPACTS>(ALL_IMPACTS);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== ALL_CATEGORIES && item.category !== category) return false;
      if (impact !== ALL_IMPACTS && item.impact !== impact) return false;
      if (!query) return true;
      const haystack = [
        item.title,
        item.company,
        item.category,
        item.impact,
        item.summary,
        item.whyItMatters,
        item.nextStep,
        ...item.tags,
        ...item.facts,
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [category, impact, items, search]);

  const hasFilters = category !== ALL_CATEGORIES || impact !== ALL_IMPACTS;
  const resetFilters = () => {
    setCategory(ALL_CATEGORIES);
    setImpact(ALL_IMPACTS);
  };

  return (
    <>
      <section className="pixel-news-filter" aria-labelledby="news-filter-heading">
        <div className="pixel-news-filter-head">
          <div><Filter size={17} aria-hidden="true" /><h2 id="news-filter-heading">情报筛选</h2></div>
          {hasFilters ? (
            <button type="button" onClick={resetFilters}><RotateCcw size={15} aria-hidden="true" /> 重置</button>
          ) : null}
        </div>

        <div className="pixel-news-filter-group">
          <span>主题</span>
          <div>
            <button type="button" className={category === ALL_CATEGORIES ? "is-active" : ""} aria-pressed={category === ALL_CATEGORIES} onClick={() => setCategory(ALL_CATEGORIES)}>全部</button>
            {SIGNAL_CATEGORIES.map((item) => (
              <button type="button" key={item} className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="pixel-news-filter-group">
          <span>优先级</span>
          <div>
            <button type="button" className={impact === ALL_IMPACTS ? "is-active" : ""} aria-pressed={impact === ALL_IMPACTS} onClick={() => setImpact(ALL_IMPACTS)}>全部级别</button>
            {SIGNAL_IMPACTS.map((item) => (
              <button type="button" key={item} className={impact === item ? "is-active" : ""} aria-pressed={impact === item} onClick={() => setImpact(item)}>{item}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="pixel-news-toolbar" aria-live="polite">
        <div><ShieldCheck size={16} aria-hidden="true" /><strong>{filteredItems.length}</strong><span> 条官方信源情报</span></div>
        {search ? <span>搜索：{search}</span> : <span><CalendarClock size={15} aria-hidden="true" /> 按发布时间倒序</span>}
      </div>

      {filteredItems.length ? (
        <section className="pixel-news-grid" aria-label="最新 AI 情报">
          {filteredItems.map((item) => <SignalCard key={item.id} item={item} />)}
        </section>
      ) : (
        <section className="pixel-empty">
          <SearchX size={26} aria-hidden="true" />
          <div><h2>没有匹配的情报</h2><p>换一个关键词，或者重置主题和优先级。</p></div>
          {hasFilters ? <PixelButton tone="blue" onClick={resetFilters}>重置筛选</PixelButton> : null}
        </section>
      )}
    </>
  );
}
