import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bot, Globe2, ShieldCheck, UsersRound } from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { FEATURED_OPC_CASES, OPC_CASES, OPC_LAST_VERIFIED, type OpcCase, type OpcEvidence } from "@/lib/opc/items";
import { SOCIAL_IMAGE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI 出海 OPC 案例",
  description: "可追溯的 AI 一人公司与极小团队案例：产品方向、获客渠道、商业模式、公开结果与团队状态。",
  alternates: { canonical: "/opc" },
  openGraph: { title: "AI 出海 OPC 案例", description: "可追溯的 AI 一人公司与极小团队案例。", url: "/opc", images: [SOCIAL_IMAGE] },
};

const STATUS_CLASS: Record<OpcCase["status"], string> = {
  current: styles.statusCurrent,
  "micro-team": styles.statusMicro,
  historical: styles.statusHistorical,
};

const EVIDENCE_KIND: Record<OpcEvidence["kind"], string> = {
  official: "产品官方",
  founder: "创始人披露",
  interview: "案例访谈",
  company: "公司公告",
};

function displayDate(date: string) {
  return date.replaceAll("-", ".");
}

function CaseCard({ item }: { item: OpcCase }) {
  return (
    <article id={item.id} className={styles.caseCard}>
      <header className={styles.caseHead}>
        <a className={styles.identity} href={item.productUrl} target="_blank" rel="noopener noreferrer">
          <span className={styles.logo}><LibraryLogo name={item.name} officialUrl={item.productUrl} /></span>
          <span>
            <strong>{item.name}</strong>
            <small>{item.founder}</small>
          </span>
        </a>
        <span className={`${styles.status} ${STATUS_CLASS[item.status]}`}>{item.statusLabel}</span>
      </header>

      <div className={styles.caseMeta}>
        <span>{item.founderRegion}</span>
        <span>{item.category}</span>
      </div>

      <div className={styles.caseResult}>
        <span>{item.direction}</span>
        <strong>{item.resultValue}</strong>
        <p>{item.resultLabel}</p>
        <time dateTime={item.resultAsOf}>披露于 {displayDate(item.resultAsOf)}</time>
      </div>

      <div className={styles.route} aria-label={`${item.name} 的主要出海路径`}>
        <span>{item.channels[0]}</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>{item.businessModel}</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>全球付费</span>
      </div>

      <p className={styles.takeaway}>{item.takeaway}</p>

      <footer className={styles.caseFooter}>
        <span><UsersRound size={15} aria-hidden="true" />{item.teamSummary}</span>
        <div>
          <a href={item.teamEvidence.url} target="_blank" rel="noopener noreferrer">
            团队证据 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href={item.resultEvidence.url} target="_blank" rel="noopener noreferrer">
            结果来源 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </article>
  );
}

export default function OpcPage() {
  const boundaryCases = OPC_CASES.filter((item) => item.status !== "current");

  return (
    <main id="main-content" className={styles.main} tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="opc-title">
        <div className={styles.heroCopy}>
          <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" />返回首页</Link>
          <span className={styles.eyebrow}><Bot size={16} aria-hidden="true" /> AI-NATIVE OPC</span>
          <h1 id="opc-title">六种 AI 出海方向，<br /><span>一人也能先跑通。</span></h1>
          <p>只收录团队状态和公开结果都能追溯的案例。当前 OPC、2–5 人极小团队与历史 OPC 分开标注。</p>
          <div className={styles.heroLegend} aria-label="案例分类">
            <span><i className={styles.currentDot} />4 个当前 OPC</span>
            <span><i className={styles.microDot} />1 个极小团队</span>
            <span><i className={styles.historyDot} />1 个历史样本</span>
          </div>
        </div>

        <aside className={styles.globalMap} aria-label="当前 OPC 产品样本">
          <header>
            <span>GLOBAL FROM DAY ONE</span>
            <time dateTime={OPC_LAST_VERIFIED}>核验 {displayDate(OPC_LAST_VERIFIED)}</time>
          </header>
          <div className={styles.globeVisual} aria-hidden="true">
            <span className={styles.orbit} />
            <span className={styles.orbitSmall} />
            <div><Globe2 size={34} /><strong>GLOBAL</strong></div>
          </div>
          <div className={styles.heroLogos}>
            {FEATURED_OPC_CASES.map((item) => (
              <a key={item.id} href={`#${item.id}`} aria-label={`查看 ${item.name} 案例`}>
                <LibraryLogo name={item.name} officialUrl={item.productUrl} />
              </a>
            ))}
          </div>
        </aside>
      </section>

      <a
        className={styles.atlasPanel}
        href="https://stripe.com/blog/top-solo-founder-traits"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="查看 Stripe Atlas 2026 一人创业数据"
      >
        <header>
          <span>STRIPE ATLAS · 2026</span>
          <strong>表现最好的 solo 公司，从第一天就面向全球。</strong>
          <ArrowUpRight size={19} aria-hidden="true" />
        </header>
        <div className={styles.atlasStats}>
          <div><strong>63%</strong><span>2026 Q2 Atlas C Corp 为单一创始人</span></div>
          <div><strong>10 国</strong><span>头部样本首月平均售达国家</span></div>
          <div><strong>51%</strong><span>头部样本收入来自海外市场</span></div>
          <div><strong>近 2×</strong><span>AI 原生 solo 公司两年收入表现</span></div>
        </div>
        <footer>聚合样本，不代表下方案例的经营结果。</footer>
      </a>

      <section className={styles.section} aria-labelledby="current-opc-title">
        <header className={styles.sectionHeader}>
          <div>
            <span>CURRENT OPC</span>
            <h2 id="current-opc-title">四个仍由一人主导的产品</h2>
          </div>
          <p>方向不同，但共同点很清楚：产品标准化、交付自动化、渠道可以复利。</p>
        </header>

        <div className={styles.caseGrid}>
          {FEATURED_OPC_CASES.map((item) => <CaseCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="boundary-title">
        <header className={styles.sectionHeader}>
          <div>
            <span>THE BOUNDARY</span>
            <h2 id="boundary-title">规模上来以后，组织会变化</h2>
          </div>
          <p>这两个样本不再算当前 OPC，但能看清一人模式何时走向组队或并购。</p>
        </header>

        <div className={styles.boundaryGrid}>
          {boundaryCases.map((item) => <CaseCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className={styles.disclosure} aria-labelledby="opc-method-title">
        <header>
          <span><ShieldCheck size={17} aria-hidden="true" /> EVIDENCE RULES</span>
          <h2 id="opc-method-title">先核团队，再看数字。</h2>
        </header>
        <div className={styles.disclosureGrid}>
          <article><strong>当前 OPC</strong><p>一位核心创始人经营，且没有公开的全职团队；外包与承包者按来源披露。</p></article>
          <article><strong>极小团队</strong><p>2–5 位核心成员，不与一人公司混排。</p></article>
          <article><strong>历史 OPC</strong><p>一人完成早期验证，后来招人、融资扩张或被收购。</p></article>
          <article><strong>结果口径</strong><p>营收、用户与利润均保留披露日期；创始人自报不等同于审计数据。</p></article>
        </div>
        <ul className={styles.sourceLegend} aria-label="证据类型">
          {Object.entries(EVIDENCE_KIND).map(([kind, label]) => <li key={kind}>{label}</li>)}
        </ul>
      </section>
    </main>
  );
}
