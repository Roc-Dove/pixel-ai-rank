import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, ExternalLink, ListChecks, Radio, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getRelatedSignals, getSignalItem, SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { absoluteUrl } from "@/lib/site";
import { formatSignalDate, formatSignalImpact, getSignalLifecycle } from "@/lib/signals/utils";
import { getLibraryItemWithGuide } from "@/lib/library/guide";

type SignalDetailPageProps = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return SIGNAL_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: SignalDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getSignalItem(id);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: {
      canonical: `/signals/${item.id}`,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      url: `/signals/${item.id}`,
      publishedTime: `${item.date}T00:00:00+08:00`,
      modifiedTime: `${SIGNALS_LAST_VERIFIED}T00:00:00+08:00`,
      tags: item.tags,
    },
  };
}

export default async function SignalDetailPage({ params }: SignalDetailPageProps) {
  const { id } = await params;
  const item = getSignalItem(id);
  if (!item) notFound();

  const relatedTools = item.relatedToolIds
    .map((toolId) => getLibraryItemWithGuide(toolId))
    .filter((tool) => tool !== null);
  const relatedSignals = getRelatedSignals(item);
  const lifecycle = getSignalLifecycle(item);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.summary,
    datePublished: item.date,
    dateModified: SIGNALS_LAST_VERIFIED,
    inLanguage: "zh-CN",
    mainEntityOfPage: absoluteUrl(`/signals/${item.id}`),
    author: { "@type": "Organization", name: "Pixel AI Rank", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Pixel AI Rank", url: absoluteUrl("/") },
    isBasedOn: item.sourceUrl,
    keywords: item.tags.join(", "),
  };

  return (
    <main id="main-content" className="pixel-shell pixel-news-detail-page" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="pixel-content-stack">
        <nav className="pixel-breadcrumb" aria-label="面包屑">
          <Link href="/signals"><ArrowLeft size={15} aria-hidden="true" /> 出海观察</Link>
          <span>/</span><span aria-current="page">{item.company}</span>
        </nav>

        <article className="pixel-news-detail">
          <header className="pixel-news-detail-header">
            <div className="pixel-news-detail-meta">
              <span>{formatSignalImpact(item.impact)}</span>
              <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
              <span>{item.company}</span>
              <span>{item.category}</span>
              <span>{item.market}</span>
              {lifecycle.status !== "ongoing" ? <span className={`is-${lifecycle.status}`}>{lifecycle.label}</span> : null}
            </div>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
            <div className="pixel-news-detail-actions">
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })}>
                阅读官方原文 <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <Link href="/signals" className={pixelButtonClassName({ tone: "ghost" })}><ArrowLeft size={16} aria-hidden="true" /> 返回出海观察</Link>
            </div>
          </header>

          <div className="pixel-news-detail-layout">
            <div className="pixel-news-detail-main">
              <section>
                <div className="pixel-news-detail-section-title"><Radio size={18} aria-hidden="true" /><h2>已经确认的事实</h2></div>
                <ul className="pixel-news-fact-list">
                  {item.facts.map((fact) => <li key={fact}><Check size={16} aria-hidden="true" /><span>{fact}</span></li>)}
                </ul>
              </section>

              <section>
                <div className="pixel-news-detail-section-title"><Compass size={18} aria-hidden="true" /><h2>出海看点</h2></div>
                <p>{item.whyItMatters}</p>
              </section>

              <section className="pixel-news-action-card">
                <div className="pixel-news-detail-section-title"><ListChecks size={18} aria-hidden="true" /><h2>关键变量</h2></div>
                <p>{item.nextStep}</p>
              </section>
            </div>

            <aside className="pixel-news-detail-aside">
              <section>
                <span className="pixel-kicker">SOURCE CHECK</span>
                <h2>来源与核验</h2>
                <dl>
                  <div><dt>发布方</dt><dd>{item.company}</dd></div>
                  <div><dt>官方来源</dt><dd>{item.sourceLabel}</dd></div>
                  <div><dt>涉及市场</dt><dd>{item.market}</dd></div>
                  <div><dt>涉及环节</dt><dd>{item.focus.join(" / ")}</dd></div>
                  <div><dt>相关产品</dt><dd>{item.applicableTo.join(" / ")}</dd></div>
                  <div><dt>发布时间</dt><dd>{formatSignalDate(item.date)}</dd></div>
                  <div><dt>本站核验</dt><dd>{SIGNALS_LAST_VERIFIED.replaceAll("-", ".")}</dd></div>
                </dl>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">打开官方页面 <ExternalLink size={15} aria-hidden="true" /></a>
              </section>

              {relatedTools.length ? (
                <section>
                  <span className="pixel-kicker">RELATED TOOLS</span>
                  <h2>相关产品</h2>
                  <div className="pixel-news-related-tools">
                    {relatedTools.map((tool) => (
                      <Link href={`/library/${tool.id}`} key={tool.id}>
                        <span>{tool.category}</span><strong>{tool.name}</strong><small>查看产品资料</small>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </article>

        {relatedSignals.length ? (
          <section className="pixel-news-more" aria-labelledby="more-signals-heading">
            <div className="pixel-section-heading compact">
              <div><span className="pixel-kicker">RELATED WATCH</span><h2 id="more-signals-heading">相关出海观察</h2></div>
              <Link href="/signals">查看全部观察 <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="pixel-news-more-grid">
              {relatedSignals.map((related) => (
                <Link href={`/signals/${related.id}`} key={related.id}>
                  <span>{related.company} · {formatSignalDate(related.date)}</span>
                  <strong>{related.title}</strong>
                  <small>{formatSignalImpact(related.impact)} <ArrowRight size={14} aria-hidden="true" /></small>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <aside className="pixel-news-method-note">
          <ShieldCheck size={19} aria-hidden="true" />
          <div><strong>编辑说明</strong><p>事实字段整理原始页面明确披露的信息；“出海看点”和“关键变量”为 Pixel AI Rank 的编辑说明，不代表发布方观点，也不构成法律、税务或投资建议。</p></div>
        </aside>
      </div>
    </main>
  );
}
