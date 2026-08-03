"use client";

import { ArrowRight, ArrowUpRight, Building2, Check, Globe2, Sparkles, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { useSearch } from "@/components/providers/SearchProvider";
import {
  GLOBAL_PRODUCTS_LAST_VERIFIED,
  INDIE_AI_PRODUCTS,
  MAINSTREAM_AI_PRODUCTS,
  type IndieProduct,
  type MainstreamProduct,
} from "@/lib/global-products";
import styles from "./GlobalProductShowcase.module.css";

function matchesQuery(item: MainstreamProduct | IndieProduct, query: string) {
  if (!query) return true;
  return Object.values(item).join(" ").toLowerCase().includes(query);
}

function MainstreamCard({ item, featured = false }: { item: MainstreamProduct; featured?: boolean }) {
  return (
    <article id={`product-${item.id}`} className={`${styles.productCard} ${featured ? styles.productCardFeatured : ""}`} style={{ "--card-accent": item.accent } as React.CSSProperties}>
      <div className={styles.productVisual}>
        <span className={styles.productLogo}><LibraryLogo name={item.name} officialUrl={item.productUrl} /></span>
        <span className={styles.visualWord} aria-hidden="true">{item.category}</span>
        <span className={styles.company}>{item.company}</span>
      </div>
      <div className={styles.productBody}>
        <div className={styles.cardTitleRow}>
          <div><h3><a href={item.productUrl} target="_blank" rel="noopener noreferrer">{item.name}</a></h3></div>
          <a href={item.productUrl} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${item.name} 官网`}><ArrowUpRight size={19} /></a>
        </div>
        <p>{item.tagline}</p>
        <dl className={styles.productFacts}>
          <div><dt>适合</dt><dd>{item.bestFor}</dd></div>
          <div><dt>产品形态</dt><dd>{item.productShape}</dd></div>
        </dl>
        <footer><span>{item.entryModel}</span><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">官方资料 <ArrowRight size={14} /></a></footer>
      </div>
    </article>
  );
}

function IndieCard({ item }: { item: IndieProduct }) {
  return (
    <article id={`product-${item.id}`} className={styles.indieCard} style={{ "--card-accent": item.accent } as React.CSSProperties}>
      <header>
        <span className={styles.indieLogo}><LibraryLogo name={item.name} officialUrl={item.productUrl} /></span>
        <span className={styles.teamBadge}><UsersRound size={14} />{item.teamLabel}</span>
      </header>
      <div className={styles.indieTitle}><span>{item.category}</span><h3><a href={item.productUrl} target="_blank" rel="noopener noreferrer">{item.name}</a></h3><p>{item.maker}</p></div>
      <p className={styles.indieTagline}>{item.tagline}</p>
      <div className={styles.indieMeta}>
        <span><Globe2 size={14} />{item.origin}</span>
        <span><Check size={14} />{item.globalSignal}</span>
        <span><UsersRound size={14} />适合 {item.bestFor}</span>
      </div>
      <footer>
        <span>{item.businessModel}</span>
        <div>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">团队资料</a>
          <a href={item.productUrl} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${item.name} 官网`}>访问 <ArrowUpRight size={15} /></a>
        </div>
      </footer>
    </article>
  );
}

export function GlobalProductShowcase() {
  const { search } = useSearch();
  const query = search.trim().toLowerCase();
  const mainstream = useMemo(() => MAINSTREAM_AI_PRODUCTS.filter((item) => matchesQuery(item, query)), [query]);
  const indie = useMemo(() => INDIE_AI_PRODUCTS.filter((item) => matchesQuery(item, query)), [query]);
  const noResults = mainstream.length === 0 && indie.length === 0;

  return (
    <main id="main-content" className={styles.main} tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="global-products-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><Globe2 size={16} /> INTERNATIONAL AI PRODUCTS</span>
          <h1 id="global-products-title">从全球产品，<br /><span>读懂 AI 出海。</span></h1>
          <p>主流产品看体验基准，独立团队看可复制的切口。只收录面向国际用户、可以在线体验或购买的 AI 软件。</p>
          <nav className={styles.laneNav} aria-label="产品分区">
            {mainstream.length > 0 ? <a href="#mainstream"><Building2 size={17} />全球主流 <strong>{mainstream.length}</strong></a> : null}
            {indie.length > 0 ? <a href="#indie"><UsersRound size={17} />Indie 出海 <strong>{indie.length}</strong></a> : null}
            <span className={styles.resultCount} aria-live="polite">{mainstream.length + indie.length} 个匹配结果</span>
          </nav>
        </div>

        <div className={styles.heroShelf} aria-label="本期收录产品">
          <header><span>GLOBAL PRODUCT SHELF</span><time dateTime={GLOBAL_PRODUCTS_LAST_VERIFIED}>核验 {GLOBAL_PRODUCTS_LAST_VERIFIED.replaceAll("-", ".")}</time></header>
          <div className={styles.heroLogoGrid}>
            {[...MAINSTREAM_AI_PRODUCTS.slice(0, 3), ...INDIE_AI_PRODUCTS.slice(0, 3)].map((item) => (
              <a key={item.id} href={item.productUrl} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${item.name} 官网`}>
                <LibraryLogo name={item.name} officialUrl={item.productUrl} />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
          <footer><span>大厂做平台</span><ArrowRight size={15} /><span>小团队做切口</span><ArrowRight size={15} /><span>共同服务全球用户</span></footer>
        </div>
      </section>

      {noResults ? (
        <section className={styles.empty}>
          <Sparkles size={24} /><div><h2>没有匹配的国际化产品</h2><p>试试搜索产品名、使用场景、创始人或“订阅”“BYOK”等模式。</p></div>
        </section>
      ) : null}

      {mainstream.length > 0 ? (
        <section id="mainstream" className={styles.section} aria-labelledby="mainstream-title">
          <header className={styles.sectionHeader}>
            <div><span>GLOBAL MAINSTREAM</span><h2 id="mainstream-title">全球主流 AI 产品</h2></div>
            <p>不是照抄功能，而是观察它们如何把复杂能力包装成全球用户一眼能懂的产品。</p>
          </header>
          <div className={styles.productGrid}>
            {mainstream.map((item, index) => <MainstreamCard key={item.id} item={item} featured={!query && index < 2} />)}
          </div>
        </section>
      ) : null}

      {indie.length > 0 ? (
        <section id="indie" className={`${styles.section} ${styles.indieSection}`} aria-labelledby="indie-title">
          <header className={styles.indieHeader}>
            <div><span>INDIE GOES GLOBAL</span><h2 id="indie-title">独立开发者，也能做全球产品</h2></div>
            <p>这里的 Indie 包括个人与小团队。共同点是产品标准化、英文优先、自助购买，并尽量减少重交付。</p>
          </header>
          <div className={styles.indieGrid}>{indie.map((item) => <IndieCard key={item.id} item={item} />)}</div>
        </section>
      ) : null}

      <section className={styles.criteria} aria-labelledby="criteria-title">
        <div><span>EDITORIAL FILTER</span><h2 id="criteria-title">怎样才算“国际化产品”</h2></div>
        <ul>
          <li><Check size={16} /><span><strong>面向全球用户</strong>英文产品或多语言入口，不以国内市场为唯一场景。</span></li>
          <li><Check size={16} /><span><strong>可以直接使用</strong>有公开官网、自助体验或清晰的购买路径。</span></li>
          <li><Check size={16} /><span><strong>产品形态成立</strong>解决具体任务，不只是一项模型能力或公司新闻。</span></li>
        </ul>
      </section>
    </main>
  );
}
