import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, CircleAlert, Compass, ExternalLink, Radio, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { formatSignalDate, getSignalItem, SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { getLibraryItemWithGuide } from "@/lib/library/guide";

type SignalDetailPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SIGNAL_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: SignalDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getSignalItem(id);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function SignalDetailPage({ params }: SignalDetailPageProps) {
  const { id } = await params;
  const item = getSignalItem(id);
  if (!item) notFound();

  const relatedTools = item.relatedToolIds
    .map((toolId) => getLibraryItemWithGuide(toolId))
    .filter((tool) => tool !== null);

  return (
    <main id="main-content" className="pixel-shell pixel-news-detail-page">
      <div className="pixel-content-stack">
        <nav className="pixel-breadcrumb" aria-label="面包屑">
          <Link href="/signals"><ArrowLeft size={15} aria-hidden="true" /> 最新 AI 情报</Link>
          <span>/</span><span aria-current="page">{item.company}</span>
        </nav>

        <article className="pixel-news-detail">
          <header className="pixel-news-detail-header">
            <div className="pixel-news-detail-meta">
              <span>{item.impact}</span>
              <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
              <span>{item.company}</span>
              <span>{item.category}</span>
            </div>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
            <div className="pixel-news-detail-actions">
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })}>
                阅读官方原文 <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <Link href="/signals" className={pixelButtonClassName({ tone: "ghost" })}><ArrowLeft size={16} aria-hidden="true" /> 返回情报页</Link>
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
                <div className="pixel-news-detail-section-title"><Compass size={18} aria-hidden="true" /><h2>为什么值得你关注</h2></div>
                <p>{item.whyItMatters}</p>
              </section>

              <section className="pixel-news-action-card">
                <div className="pixel-news-detail-section-title"><CircleAlert size={18} aria-hidden="true" /><h2>建议下一步</h2></div>
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
                  <div><dt>发布时间</dt><dd>{formatSignalDate(item.date)}</dd></div>
                  <div><dt>本站核验</dt><dd>{SIGNALS_LAST_VERIFIED.replaceAll("-", ".")}</dd></div>
                </dl>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">打开官方页面 <ExternalLink size={15} aria-hidden="true" /></a>
              </section>

              {relatedTools.length ? (
                <section>
                  <span className="pixel-kicker">RELATED TOOLS</span>
                  <h2>相关工具</h2>
                  <div className="pixel-news-related-tools">
                    {relatedTools.map((tool) => (
                      <Link href={`/library/${tool.id}`} key={tool.id}>
                        <span>{tool.category}</span><strong>{tool.name}</strong><small>推荐指数 {tool.guide.recommendation}</small>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </article>

        <aside className="pixel-news-method-note">
          <ShieldCheck size={19} aria-hidden="true" />
          <div><strong>编辑说明</strong><p>事实字段只整理官方页面明确披露的信息；“为什么重要”和“建议下一步”是 Pixel AI Rank 的编辑判断，不代表发布方观点。</p></div>
        </aside>
      </div>
    </main>
  );
}
