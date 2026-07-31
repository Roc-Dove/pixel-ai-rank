"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Filter, RotateCcw, SearchX, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearch } from "@/components/providers/SearchProvider";
import { SignalCategoryVisual } from "@/components/signals/SignalCategoryVisual";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";
import { formatSignalImpact, getSignalLifecycle } from "@/lib/signals/utils";
import { SIGNAL_CATEGORIES, SIGNAL_IMPACTS, type SignalCategory, type SignalImpact, type SignalItem } from "@/types/signal";
import styles from "./SignalsExplorer.module.css";

const ALL_CATEGORIES = "全部";
const ALL_IMPACTS = "全部类型";
const PAGE_SIZE = 12;

function SignalCard({ item }: { item: SignalItem }) {
  const lifecycle = getSignalLifecycle(item);

  return (
    <article className={styles.card}>
      <SignalCategoryVisual
        category={item.category}
        company={item.company}
        date={item.date}
        id={item.id}
        impact={item.impact}
        market={item.market}
        sourceLabel={item.sourceLabel}
        sourceUrl={item.sourceUrl}
        title={item.title}
      />

      <div className={styles.copy}>
        <p>{item.summary}</p>
        <div className={styles.context} aria-label={`涉及环节：${item.focus.join("、")}`}>
          {item.focus.slice(0, 3).map((focus) => <span key={focus}>{focus}</span>)}
        </div>
      </div>

      {lifecycle.status !== "ongoing" ? (
        <div className={`${styles.lifecycle} ${styles[lifecycle.status]}`}>
          <CalendarClock size={14} aria-hidden="true" />
          <span>{lifecycle.label}</span>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Link
          href={`/signals/${item.id}`}
          prefetch={false}
          className={`${pixelButtonClassName({ tone: "blue" })} ${styles.detailLink}`}
          aria-label={`查看“${item.title}”详情`}
        >
          阅读观察 <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.officialLink}>
          原始来源 <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function SignalsExplorer({ items }: { items: SignalItem[] }) {
  const { search } = useSearch();
  const [category, setCategory] = useState<SignalCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [impact, setImpact] = useState<SignalImpact | typeof ALL_IMPACTS>(ALL_IMPACTS);
  const [pagination, setPagination] = useState({ key: "", limit: PAGE_SIZE });

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
        formatSignalImpact(item.impact),
        item.summary,
        item.whyItMatters,
        item.nextStep,
        item.market,
        ...item.focus,
        ...item.applicableTo,
        ...item.tags,
        ...item.facts,
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [category, impact, items, search]);

  const filterKey = `${category}:${impact}:${search.trim().toLowerCase()}`;
  const visibleLimit = pagination.key === filterKey ? pagination.limit : PAGE_SIZE;
  const visibleItems = filteredItems.slice(0, visibleLimit);
  const hasMore = visibleItems.length < filteredItems.length;
  const hasFilters = category !== ALL_CATEGORIES || impact !== ALL_IMPACTS;
  const resetFilters = () => {
    setCategory(ALL_CATEGORIES);
    setImpact(ALL_IMPACTS);
  };

  return (
    <>
      <section className="pixel-news-filter" aria-labelledby="news-filter-heading">
        <div className="pixel-news-filter-head">
          <div><Filter size={17} aria-hidden="true" /><h2 id="news-filter-heading">筛选出海观察</h2></div>
          {hasFilters ? (
            <button type="button" onClick={resetFilters}><RotateCcw size={15} aria-hidden="true" /> 重置</button>
          ) : null}
        </div>

        <div className="pixel-news-filter-group">
          <span>主线</span>
          <div>
            <button type="button" className={category === ALL_CATEGORIES ? "is-active" : ""} aria-pressed={category === ALL_CATEGORIES} onClick={() => setCategory(ALL_CATEGORIES)}>全部</button>
            {SIGNAL_CATEGORIES.map((item) => (
              <button type="button" key={item} className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="pixel-news-filter-group">
          <span>内容类型</span>
          <div>
            <button type="button" className={impact === ALL_IMPACTS ? "is-active" : ""} aria-pressed={impact === ALL_IMPACTS} onClick={() => setImpact(ALL_IMPACTS)}>全部类型</button>
            {SIGNAL_IMPACTS.map((item) => (
              <button type="button" key={item} className={impact === item ? "is-active" : ""} aria-pressed={impact === item} onClick={() => setImpact(item)}>{formatSignalImpact(item)}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="pixel-news-toolbar" aria-live="polite">
        <div><ShieldCheck size={16} aria-hidden="true" /><strong>{filteredItems.length}</strong><span> 条带原始来源的观察</span></div>
        {search ? <span>搜索：{search}</span> : <span><CalendarClock size={15} aria-hidden="true" /> 按发布时间倒序</span>}
      </div>

      {filteredItems.length ? (
        <>
          <section className="pixel-news-grid" aria-label="最新出海观察">
            {visibleItems.map((item) => <SignalCard key={item.id} item={item} />)}
          </section>
          {hasMore ? (
            <div className="pixel-load-more">
              <p>已显示 {visibleItems.length} / {filteredItems.length}</p>
              <PixelButton
                tone="ghost"
                onClick={() => setPagination({ key: filterKey, limit: visibleLimit + PAGE_SIZE })}
              >
                加载更多（{Math.min(PAGE_SIZE, filteredItems.length - visibleItems.length)} 条）
              </PixelButton>
            </div>
          ) : null}
        </>
      ) : (
        <section className="pixel-empty">
          <SearchX size={26} aria-hidden="true" />
          <div><h2>没有匹配的观察</h2><p>换一个关键词，或者重置主线和内容类型。</p></div>
          {hasFilters ? <PixelButton tone="blue" onClick={resetFilters}>重置筛选</PixelButton> : null}
        </section>
      )}
    </>
  );
}
