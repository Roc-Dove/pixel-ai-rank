import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  Gauge,
  Globe2,
  LibraryBig,
  ListChecks,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { SignalPulse } from "@/components/signals/SignalPulse";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { INTERNATIONAL_PRODUCT_COUNT } from "@/lib/global-products";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { formatSignalDate, formatSignalImpact } from "@/lib/signals/utils";
import { SIGNAL_CATEGORIES, SIGNAL_IMPACTS, type SignalCategory, type SignalImpact } from "@/types/signal";

export const metadata: Metadata = {
  title: "AI 产品、KOL 与出海观察",
  description: "面向中国 AI 产品团队，整理产品机会、KOL 传播与海外市场变化。",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const revalidate = 3600;

type HomeSignalVisual = {
  value: string;
  label: string;
  icon: LucideIcon;
  tone: "blue" | "coral" | "purple" | "green";
  nodes?: string[];
};

const HOME_SIGNAL_VISUALS: Record<string, HomeSignalVisual> = {
  "google-play-us-third-party-catalog": {
    value: "7.22",
    label: "美国目录开放",
    icon: Globe2,
    tone: "blue",
    nodes: ["目录", "交易", "归因"],
  },
  "instagram-reels-ai-translation-expansion": {
    value: "5 种",
    label: "Reels 新增语言",
    icon: Radio,
    tone: "coral",
    nodes: ["日韩", "法国", "德国"],
  },
  "google-play-new-service-fees-2026": {
    value: "20%",
    label: "非经常性交易费",
    icon: Gauge,
    tone: "green",
    nodes: ["欧洲", "英国", "美国"],
  },
  "android-developer-verification-first-markets": {
    value: "4 个",
    label: "首批验证市场",
    icon: ShieldCheck,
    tone: "purple",
    nodes: ["巴西", "印尼", "新加坡"],
  },
};

function getFallbackSignalVisual(category: SignalCategory): HomeSignalVisual {
  return {
    value: category,
    label: "最新来源观察",
    icon: Activity,
    tone: "blue",
  };
}

export default function HomePage() {
  const libraryItems = getLibraryItemsWithGuide();
  const topTools = [...libraryItems]
    .filter((item) => item.officialUrl && item.guideDepth === "individual")
    .sort((left, right) => right.guide.recommendation - left.guide.recommendation || left.name.localeCompare(right.name))
    .slice(0, 6);
  const latestSignals = SIGNAL_ITEMS.slice(0, 4);
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
  const companies = new Set(SIGNAL_ITEMS.map((item) => item.company)).size;
  const verifiedStamp = SIGNALS_LAST_VERIFIED.replaceAll("-", ".");

  return (
    <main id="main-content" className="pixel-home pixel-home-visual-refresh" tabIndex={-1}>
      <section className="pixel-home-hero pixel-home-hero-visual" aria-labelledby="home-hero-title">
        <div className="pixel-home-hero-copy">
          <span className="pixel-kicker"><Globe2 size={16} aria-hidden="true" /> GLOBAL WATCH · VERIFIED {verifiedStamp}</span>
          <h1 id="home-hero-title">中国 AI 产品，<br /><span>如何走向全球。</span></h1>
          <p>用原始来源整理产品机会、KOL 传播与海外市场变化。</p>
          <div className="pixel-home-actions">
            <Link href="/signals" className={pixelButtonClassName({ tone: "blue" })}>
              查看出海观察 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/rank/aicpb" className={pixelButtonClassName({ tone: "ghost" })}>
              浏览国际 AI 产品
            </Link>
          </div>
          <div className="pixel-home-proofline" aria-label="当前内容摘要">
            <span><strong>{INTERNATIONAL_PRODUCT_COUNT}</strong> 个国际产品</span>
            <i aria-hidden="true" />
            <span><strong>{companies}</strong> 个来源主体</span>
            <i aria-hidden="true" />
            <span><strong>{SIGNAL_ITEMS.length}</strong> 条来源观察</span>
          </div>
        </div>

        <SignalPulse
          total={SIGNAL_ITEMS.length}
          companies={companies}
          impactCounts={impactCounts}
          categoryCounts={categoryCounts}
        />
      </section>

      <section className="pixel-home-section pixel-home-news pixel-home-visual-news">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Radio size={15} aria-hidden="true" /> GLOBAL SNAPSHOT</span>
            <h2>近期出海观察</h2>
          </div>
          <Link href="/signals">查看全部 {SIGNAL_ITEMS.length} 条 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className="pixel-snapshot-grid">
          {latestSignals.map((item, index) => {
            const visual = HOME_SIGNAL_VISUALS[item.id] ?? getFallbackSignalVisual(item.category);
            const VisualIcon = visual.icon;

            return (
              <Link
                href={`/signals/${item.id}`}
                key={item.id}
                className={`pixel-snapshot-card tone-${visual.tone} ${index === 0 ? "is-lead" : ""}`}
              >
                <div className="pixel-snapshot-meta">
                  <span>{item.company}</span>
                  <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
                  <strong>{formatSignalImpact(item.impact)}</strong>
                </div>
                <div className="pixel-snapshot-visual">
                  <span className="pixel-snapshot-icon"><VisualIcon size={index === 0 ? 34 : 26} strokeWidth={1.65} aria-hidden="true" /></span>
                  <div>
                    <strong>{visual.value}</strong>
                    <span>{visual.label}</span>
                  </div>
                  {visual.nodes ? (
                    <div className="pixel-snapshot-nodes" aria-label={visual.nodes.join("，")}>
                      {visual.nodes.map((node) => <span key={node}>{node}</span>)}
                    </div>
                  ) : null}
                </div>
                <h3>{item.title}</h3>
                <span className="pixel-entry-link">查看来源与解读 <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pixel-home-section pixel-home-decisions">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker">SITE INDEX</span>
            <h2>按内容类型浏览</h2>
          </div>
        </div>

        <div className="pixel-decision-grid">
          <Link href="/signals" className="pixel-decision-card tone-red">
            <div className="pixel-decision-graphic is-wave" aria-hidden="true">
              {[28, 58, 42, 84, 52, 70, 34].map((height, index) => (
                <i key={`${height}-${index}`} style={{ "--wave-height": `${height}%` } as CSSProperties} />
              ))}
            </div>
            <div>
              <span><Radio size={18} aria-hidden="true" /> {SIGNAL_ITEMS.length} 条附来源</span>
              <h3>出海观察</h3>
              <p>查看分发、支付、本地化与平台规则变化。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <Link href="/library" className="pixel-decision-card tone-blue">
            <div className="pixel-decision-graphic is-mosaic" aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
            </div>
            <div>
              <span><LibraryBig size={18} aria-hidden="true" /> {libraryItems.length} 个产品</span>
              <h3>AI 产品库</h3>
              <p>按人群、场景与使用门槛筛选。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <Link href="/rank/aicpb" className="pixel-decision-card tone-purple">
            <div className="pixel-decision-graphic is-podium" aria-hidden="true">
              <i><span>2</span></i><i><span>1</span></i><i><span>3</span></i>
            </div>
            <div>
              <span><Trophy size={18} aria-hidden="true" /> {INTERNATIONAL_PRODUCT_COUNT} 个已整理</span>
              <h3>国际 AI 产品</h3>
              <p>用原有榜单方式查看产品与数据口径。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="pixel-home-section pixel-home-picks pixel-home-tool-radar">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Sparkles size={15} aria-hidden="true" /> PRODUCT RADAR</span>
            <h2>综合评分靠前的 6 个 AI 产品</h2>
          </div>
          <Link href="/library">打开产品库 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className="pixel-tool-radar-grid">
          {topTools.map((item, index) => (
            <Link href={`/library/${item.id}`} key={item.id} className="pixel-tool-radar-card">
              <span className="pixel-tool-rank">0{index + 1}</span>
              <LibraryLogo name={item.name} officialUrl={item.officialUrl} />
              <div className="pixel-tool-radar-copy">
                <h3>{item.name}</h3>
                <span>{item.category}</span>
              </div>
              <div
                className="pixel-tool-score-ring"
                style={{ "--tool-score": `${item.guide.recommendation * 3.6}deg` } as CSSProperties}
                role="img"
                aria-label={`${item.name} 编辑评分 ${item.guide.recommendation}`}
              >
                <strong>{item.guide.recommendation}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pixel-trust-flow" aria-labelledby="trust-flow-heading">
        <header>
          <span className="pixel-kicker">EDITORIAL METHOD</span>
          <h2 id="trust-flow-heading">信息整理方式</h2>
        </header>
        <div>
          <span className="pixel-trust-node">
            <i><FileCheck2 size={23} aria-hidden="true" /></i>
            <strong>原始来源</strong>
            <small>保留公司、日期与链接</small>
          </span>
          <ArrowRight className="pixel-trust-arrow" size={20} aria-hidden="true" />
          <span className="pixel-trust-node">
            <i><Scale size={23} aria-hidden="true" /></i>
            <strong>编辑核验</strong>
            <small>事实和判断分开</small>
          </span>
          <ArrowRight className="pixel-trust-arrow" size={20} aria-hidden="true" />
          <span className="pixel-trust-node">
            <i><ListChecks size={23} aria-hidden="true" /></i>
            <strong>边界说明</strong>
            <small>标注来源、口径与适用范围</small>
          </span>
        </div>
      </section>
    </main>
  );
}
