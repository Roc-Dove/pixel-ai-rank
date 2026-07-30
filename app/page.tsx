import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  Gauge,
  GraduationCap,
  LibraryBig,
  ListChecks,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Trophy,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { SignalPulse } from "@/components/signals/SignalPulse";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { formatSignalDate, formatSignalImpact } from "@/lib/signals/utils";
import { SIGNAL_CATEGORIES, SIGNAL_IMPACTS, type SignalCategory, type SignalImpact } from "@/types/signal";

export const metadata: Metadata = {
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
  "chatgpt-academic-researchers": {
    value: "10万",
    label: "计划覆盖研究者",
    icon: GraduationCap,
    tone: "blue",
    nodes: ["1 万起步", "2027", "10 万"],
  },
  "gpt-5-6-efficiency-engineering": {
    value: "−20%",
    label: "披露服务成本",
    icon: Gauge,
    tone: "green",
    nodes: ["推理", "负载", "内核"],
  },
  "microsoft-project-perception": {
    value: "4 层",
    label: "Agent 安全边界",
    icon: ShieldCheck,
    tone: "purple",
    nodes: ["身份", "权限", "执行", "审计"],
  },
  "meta-muse-spark-acts": {
    value: "执行",
    label: "从回答走向行动",
    icon: Workflow,
    tone: "coral",
    nodes: ["观察", "推理", "行动"],
  },
};

function getFallbackSignalVisual(category: SignalCategory): HomeSignalVisual {
  return {
    value: category.replace("升级", ""),
    label: "最新官方动态",
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
      <section className="pixel-home-hero pixel-home-hero-visual">
        <div className="pixel-home-hero-copy">
          <span className="pixel-kicker"><Radio size={16} aria-hidden="true" /> VERIFIED {verifiedStamp}</span>
          <h1>每天 3 分钟，<br /><span>看懂 AI 在变什么。</span></h1>
          <p>收录经核验的官方 AI 动态，并标注发布时间、来源和信息类型。</p>
          <div className="pixel-home-actions">
            <Link href="/signals" className={pixelButtonClassName({ tone: "blue" })}>
              浏览 AI 动态 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}>
              浏览工具库
            </Link>
          </div>
          <div className="pixel-home-proofline" aria-label="情报核验摘要">
            <span><strong>100%</strong> 官方源</span>
            <i aria-hidden="true" />
            <span><strong>{companies}</strong> 家公司</span>
            <i aria-hidden="true" />
            <span><strong>{SIGNAL_ITEMS.length}</strong> 条信号</span>
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
            <span className="pixel-kicker"><Radio size={15} aria-hidden="true" /> SIGNAL SNAPSHOT</span>
            <h2>近期 AI 动态</h2>
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
                <span className="pixel-entry-link">查看详情 <ArrowRight size={16} aria-hidden="true" /></span>
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
              <span><Radio size={18} aria-hidden="true" /> {SIGNAL_ITEMS.length} 条已核验</span>
              <h3>最新 AI 动态</h3>
              <p>按发布时间查看官方发布。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <Link href="/library" className="pixel-decision-card tone-blue">
            <div className="pixel-decision-graphic is-mosaic" aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
            </div>
            <div>
              <span><LibraryBig size={18} aria-hidden="true" /> {libraryItems.length} 个工具</span>
              <h3>AI 工具分类</h3>
              <p>按人群、场景与难度筛选。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <Link href="/rank/month" className="pixel-decision-card tone-purple">
            <div className="pixel-decision-graphic is-podium" aria-hidden="true">
              <i><span>2</span></i><i><span>1</span></i><i><span>3</span></i>
            </div>
            <div>
              <span><Trophy size={18} aria-hidden="true" /> 5 份榜单</span>
              <h3>AI 产品榜单</h3>
              <p>查看榜单结果与数据口径。</p>
            </div>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="pixel-home-section pixel-home-picks pixel-home-tool-radar">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Sparkles size={15} aria-hidden="true" /> TOOL RADAR</span>
            <h2>综合评分靠前的 6 个工具</h2>
          </div>
          <Link href="/library">打开工具库 <ArrowRight size={16} aria-hidden="true" /></Link>
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
            <strong>官方原文</strong>
            <small>只从一手信源开始</small>
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
            <strong>编辑解读</strong>
            <small>标注影响范围与评估维度</small>
          </span>
        </div>
      </section>
    </main>
  );
}
