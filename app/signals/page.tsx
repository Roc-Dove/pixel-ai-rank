import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CircleAlert, Radio, Rss, ShieldCheck } from "lucide-react";
import { SignalsExplorer } from "@/components/signals/SignalsExplorer";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { getSignalLifecycle } from "@/lib/signals/utils";

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

  return (
    <main id="main-content" className="pixel-shell pixel-news-page" tabIndex={-1}>
      <div className="pixel-content-stack">
        <section className="pixel-news-hero">
          <div className="pixel-news-hero-copy">
            <span className="pixel-kicker"><Radio size={16} aria-hidden="true" /> OFFICIAL SIGNAL FEED</span>
            <h1>最新 AI 情报，<br /><span>只保留能改变决策的。</span></h1>
            <p>从官方发布中筛掉重复转述，补上“为什么重要”和“下一步做什么”。不是新闻搬运，而是给产品、开发和内容团队的行动层。</p>
            <div className="pixel-news-hero-actions">
              <a href="#latest-signals" className={pixelButtonClassName({ tone: "blue" })}>查看最新情报 <ArrowRight size={16} aria-hidden="true" /></a>
              <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}>浏览工具库</Link>
              <a href="/feed.xml" className={pixelButtonClassName({ tone: "ghost" })}><Rss size={16} aria-hidden="true" /> 订阅 RSS</a>
            </div>
          </div>

          <dl className="pixel-news-hero-facts">
            <div><dt>已核验情报</dt><dd>{SIGNAL_ITEMS.length}</dd></div>
            <div><dt>覆盖公司</dt><dd>{companies}</dd></div>
            <div><dt>官方信源</dt><dd>100%</dd></div>
            <div><dt>核验日期</dt><dd>{SIGNALS_LAST_VERIFIED.slice(5).replace("-", ".")}</dd></div>
          </dl>
        </section>

        {urgentItems.length ? (
          <section id="action-required" className="pixel-news-alert" aria-labelledby="urgent-signals-heading">
            <div className="pixel-news-alert-icon"><CircleAlert size={21} aria-hidden="true" /></div>
            <div>
              <span className="pixel-kicker">ACTION REQUIRED</span>
              <h2 id="urgent-signals-heading">有 {urgentItems.length} 条行动项需要处理</h2>
            </div>
            <div className="pixel-news-alert-items">
              {urgentItems.map((item) => (
                <Link href={`/signals/${item.id}`} key={item.id}>
                  <span>{item.company}</span>
                  <strong>{item.title}</strong>
                  <small className={`is-${getSignalLifecycle(item).status}`}>{getSignalLifecycle(item).label}</small>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section id="latest-signals" className="pixel-news-feed">
          <div className="pixel-section-heading">
            <div><span className="pixel-kicker"><CalendarDays size={15} aria-hidden="true" /> VERIFIED {verifiedStamp}</span><h2>最近值得知道的变化</h2></div>
            <p><ShieldCheck size={15} aria-hidden="true" /> 所有条目直达厂商官方原文</p>
          </div>
          <SignalsExplorer items={SIGNAL_ITEMS} />
        </section>
      </div>
    </main>
  );
}
