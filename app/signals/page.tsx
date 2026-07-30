import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CircleAlert, Radio, Rss, ShieldCheck } from "lucide-react";
import { SignalsExplorer } from "@/components/signals/SignalsExplorer";
import { SignalPulse } from "@/components/signals/SignalPulse";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { getSignalLifecycle } from "@/lib/signals/utils";
import { SIGNAL_CATEGORIES, SIGNAL_IMPACTS, type SignalImpact } from "@/types/signal";

export const metadata: Metadata = {
  title: "最新 AI 情报",
  description: "截至 2026 年 7 月 30 日核验的 AI 模型、Agent、编程工具和产品变更，全部链接到官方信源并给出行动建议。",
  alternates: {
    canonical: "/signals",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const revalidate = 3600;

export default function SignalsPage() {
  const actionPriority = {
    "due-today": 0,
    overdue: 1,
    open: 2,
    upcoming: 3,
    retired: 4,
    ongoing: 5,
  } as const;
  const urgentItems = SIGNAL_ITEMS
    .filter((item) => item.impact === "立即行动")
    .sort(
      (left, right) =>
        actionPriority[getSignalLifecycle(left).status] - actionPriority[getSignalLifecycle(right).status] ||
        right.date.localeCompare(left.date),
    );
  const companies = new Set(SIGNAL_ITEMS.map((item) => item.company)).size;
  const verifiedStamp = SIGNALS_LAST_VERIFIED.replaceAll("-", ".");
  const impactCounts = SIGNAL_IMPACTS.reduce(
    (counts, impact) => {
      counts[impact] = SIGNAL_ITEMS.filter((item) => item.impact === impact).length;
      return counts;
    },
    {} as Record<SignalImpact, number>,
  );
  const categoryCounts = SIGNAL_CATEGORIES.map((category) => ({
    category,
    count: SIGNAL_ITEMS.filter((item) => item.category === category).length,
  }));

  return (
    <main id="main-content" className="pixel-shell pixel-news-page" tabIndex={-1}>
      <div className="pixel-content-stack">
        <section className="pixel-news-hero pixel-news-hero-visual">
          <div className="pixel-news-hero-copy">
            <span className="pixel-kicker"><Radio size={16} aria-hidden="true" /> OFFICIAL SIGNAL FEED</span>
            <h1>{SIGNAL_ITEMS.length} 条官方 AI 动态，<br /><span>一眼看完重点。</span></h1>
            <p>按“立刻做、值得看、先观察”整理，完整解释留在情报详情里。</p>
            <div className="pixel-news-hero-actions">
              <a href="#latest-signals" className={pixelButtonClassName({ tone: "blue" })}>开始速览 <ArrowRight size={16} aria-hidden="true" /></a>
              <a href="/feed.xml" className={pixelButtonClassName({ tone: "ghost" })}><Rss size={16} aria-hidden="true" /> 订阅 RSS</a>
            </div>
          </div>

          <SignalPulse
            total={SIGNAL_ITEMS.length}
            companies={companies}
            impactCounts={impactCounts}
            categoryCounts={categoryCounts}
            compact
          />
        </section>

        {urgentItems.length ? (
          <section id="action-required" className="pixel-news-action-board" aria-labelledby="urgent-signals-heading">
            <header>
              <span className="pixel-news-alert-icon"><CircleAlert size={21} aria-hidden="true" /></span>
              <div>
                <span className="pixel-kicker">ACTION REQUIRED</span>
                <h2 id="urgent-signals-heading">今天先处理这 {urgentItems.length} 件事</h2>
              </div>
            </header>
            <div className="pixel-news-action-timeline">
              {urgentItems.map((item) => (
                <Link href={`/signals/${item.id}`} key={item.id}>
                  <i aria-hidden="true" />
                  <span>{item.company}</span>
                  <strong>{item.title}</strong>
                  <small className={`is-${getSignalLifecycle(item).status}`}>{getSignalLifecycle(item).label}</small>
                  <b>{item.actionLabel ?? "查看怎么做"} <ArrowRight size={15} aria-hidden="true" /></b>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section id="latest-signals" className="pixel-news-feed">
          <div className="pixel-section-heading">
            <div><span className="pixel-kicker"><CalendarDays size={15} aria-hidden="true" /> VERIFIED {verifiedStamp}</span><h2>最近最值得关注的 AI 动态</h2></div>
            <p><ShieldCheck size={15} aria-hidden="true" /> 所有条目直达厂商官方原文</p>
          </div>
          <SignalsExplorer items={SIGNAL_ITEMS} />
        </section>
      </div>
    </main>
  );
}
