import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, LibraryBig, Radio, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { RankTypeIcon } from "@/components/rank/RankTypeIcon";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { formatSignalDate, getSignalLifecycle } from "@/lib/signals/utils";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const revalidate = 3600;

export default function HomePage() {
  const libraryItems = getLibraryItemsWithGuide();
  const topTools = [...libraryItems]
    .filter((item) => item.officialUrl)
    .sort((left, right) => right.guide.recommendation - left.guide.recommendation || left.name.localeCompare(right.name))
    .slice(0, 6);
  const latestSignals = SIGNAL_ITEMS.slice(0, 6);
  const urgentItems = SIGNAL_ITEMS.filter((item) => item.impact === "立即行动");
  const urgentCount = urgentItems.length;
  const dueTodayCount = urgentItems.filter((item) => getSignalLifecycle(item).status === "due-today").length;
  const lifecyclePriority = {
    "due-today": 0,
    overdue: 1,
    open: 2,
    upcoming: 3,
    retired: 4,
    ongoing: 5,
  } as const;
  const radarSignals = [...urgentItems]
    .sort(
      (left, right) =>
        lifecyclePriority[getSignalLifecycle(left).status] - lifecyclePriority[getSignalLifecycle(right).status] ||
        right.date.localeCompare(left.date),
    )
    .slice(0, 3);
  const verifiedStamp = SIGNALS_LAST_VERIFIED.replaceAll("-", ".");

  return (
    <main id="main-content" className="pixel-home" tabIndex={-1}>
      <section className="pixel-home-hero pixel-home-hero-v2">
        <div className="pixel-home-hero-copy">
          <span className="pixel-kicker"><Radio size={16} aria-hidden="true" /> VERIFIED {verifiedStamp}</span>
          <h1>AI 更新太快，<br /><span>先看值得行动的。</span></h1>
          <p>
            Pixel AI Rank 把官方最新发布、产品变更、排行榜和中文工具导购放进同一个决策界面。少一点追热点，多一点下一步。
          </p>
          <div className="pixel-home-actions">
            <Link href="/signals#action-required" className={pixelButtonClassName({ tone: "blue" })}>
              处理 {urgentCount} 条行动项{dueTodayCount ? ` · ${dueTodayCount} 条今日截止` : ""} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}>
              浏览 {libraryItems.length} 个工具
            </Link>
          </div>
          <div className="pixel-home-trust">
            <span><ShieldCheck size={16} aria-hidden="true" /> 情报直达官方原文</span>
            <span><CalendarDays size={16} aria-hidden="true" /> 标注发布时间与核验日</span>
            <span><BookOpenCheck size={16} aria-hidden="true" /> 每条补充行动建议</span>
          </div>
        </div>

        <div className="pixel-home-radar pixel-home-radar-news" aria-label="最新高信号 AI 情报">
          <div className="pixel-radar-header">
            <div>
              <span className="pixel-live-dot" aria-hidden="true" />
              <strong>ACTION QUEUE</strong>
            </div>
            <span>OFFICIAL ONLY</span>
          </div>
          <div className="pixel-radar-list">
            {radarSignals.map((item, index) => {
              const lifecycle = getSignalLifecycle(item);
              const lifecycleTone = lifecycle.status === "due-today" || lifecycle.status === "overdue"
                ? "urgent"
                : lifecycle.status === "open"
                  ? "focus"
                  : "watch";

              return (
                <Link href={`/signals/${item.id}`} key={item.id} className="pixel-radar-item">
                  <span className="pixel-radar-rank">0{index + 1}</span>
                  <span className="pixel-radar-tool">
                    <strong>{item.title}</strong>
                    <small>{item.company} · {formatSignalDate(item.date)}</small>
                  </span>
                  <span className={`pixel-radar-impact is-${lifecycleTone}`}>{lifecycle.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="pixel-radar-footer">
            <Link href="/signals#action-required">{urgentCount} 条待处理</Link>
            <div><span style={{ width: "100%" }} /></div>
            <span>已核验</span>
          </div>
        </div>
      </section>

      <section className="pixel-home-stats" aria-label="内容规模">
        <div><strong>{SIGNAL_ITEMS.length}</strong><span>官方信源情报</span></div>
        <div><strong>100%</strong><span>情报官方源</span></div>
        <div><strong>{libraryItems.length}</strong><span>精选 AI 工具</span></div>
        <div><strong>{SIGNALS_LAST_VERIFIED.slice(5).replace("-", ".")}</strong><span>最近核验</span></div>
      </section>

      <section className="pixel-home-section pixel-home-news">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Radio size={15} aria-hidden="true" /> SIGNALS, NOT NOISE</span>
            <h2>这几条，正在改变选择</h2>
          </div>
          <Link href="/signals">查看全部 {SIGNAL_ITEMS.length} 条 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className="pixel-home-news-grid">
          {latestSignals.slice(0, 4).map((item, index) => (
            <Link href={`/signals/${item.id}`} key={item.id} className={index === 0 ? "pixel-home-news-card is-lead" : "pixel-home-news-card"}>
              <div className="pixel-home-news-meta">
                <span>{formatSignalDate(item.date)}</span>
                <span>{item.company}</span>
                <strong>{item.impact}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="pixel-home-news-why">
                <span>WHY IT MATTERS</span>
                <p>{item.whyItMatters}</p>
              </div>
              <span className="pixel-entry-link">打开情报卡 <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pixel-home-section">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker">START WITH A DECISION</span>
            <h2>按你要解决的问题进入</h2>
          </div>
          <p>先明确决策，再选择信息入口。</p>
        </div>

        <div className="pixel-entry-grid">
          <Link href="/signals" className="pixel-entry-card tone-red">
            <span className="pixel-entry-icon"><Radio size={24} strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="pixel-entry-index">01</span>
            <h3>今天发生了什么</h3>
            <p>从官方发布里找到模型升级、Agent、AI 编程和产品迁移信号，并直接拿到下一步建议。</p>
            <span className="pixel-entry-link">打开最新情报 <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link href="/library" className="pixel-entry-card tone-blue">
            <span className="pixel-entry-icon"><LibraryBig size={24} strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="pixel-entry-index">02</span>
            <h3>下一款工具选什么</h3>
            <p>按人群、用途、上手难度和中文友好度筛选，并查看哪些资料刚刚经过官方核验。</p>
            <span className="pixel-entry-link">进入 AI 工具库 <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link href="/rank/aicpb" className="pixel-entry-card tone-purple">
            <span className="pixel-entry-icon"><RankTypeIcon type="aicpb" size={24} /></span>
            <span className="pixel-entry-index">03</span>
            <h3>哪些产品和人值得跟踪</h3>
            <p>查看产品榜与中外 AI KOL；真实抓取、历史过期、本站精选和演示模式都会明确标注。</p>
            <span className="pixel-entry-link">查看排行榜 <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      <section className="pixel-home-section pixel-home-picks">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Sparkles size={15} aria-hidden="true" /> UPDATED TOOL RADAR</span>
            <h2>现在最值得试的 6 个工具</h2>
          </div>
          <Link href="/library">查看全部 {libraryItems.length} 个 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className="pixel-picks-grid">
          {topTools.map((item, index) => (
            <Link href={`/library/${item.id}`} key={item.id} className="pixel-pick-card">
              <div className="pixel-pick-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.verifiedAt ? "近期核验" : item.category}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.descriptionZh}</p>
              <div className="pixel-pick-footer">
                <span>推荐指数</span>
                <strong>{item.guide.recommendation}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pixel-method-section">
        <div>
          <span className="pixel-kicker"><Radar size={15} aria-hidden="true" /> EDITORIAL METHOD</span>
          <h2>新鲜只是门槛，<br />可信才是价值。</h2>
        </div>
        <ol className="pixel-method-list">
          <li><span>01</span><div><strong>官方源优先</strong><p>最新情报只使用公司公告、产品文档和官方模型仓库，不用二次转载补事实。</p></div></li>
          <li><span>02</span><div><strong>事实与判断分开</strong><p>产品披露、编辑影响判断和下一步建议分别呈现，保留你的判断空间。</p></div></li>
          <li><span>03</span><div><strong>状态明确</strong><p>榜单会区分实时、过期、降级和精选数据；预览、限量开放和正式 GA 不混写。</p></div></li>
        </ol>
      </section>
    </main>
  );
}
