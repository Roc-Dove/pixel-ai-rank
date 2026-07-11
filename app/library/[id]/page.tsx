import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, CircleMinus, Compass, ExternalLink, Lightbulb, ShieldAlert, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemWithGuide } from "@/lib/library/guide";
import { LIBRARY_ITEMS } from "@/lib/library/items";

type LibraryDetailPageProps = { params: Promise<{ id: string }> };

function getLogoUrl(officialUrl: string | null) {
  if (!officialUrl) return null;
  try {
    const url = new URL(officialUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function DetailList({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: LucideIcon; tone: string }) {
  return (
    <section className={`pixel-detail-card tone-${tone}`}>
      <div className="pixel-detail-card-heading"><span><Icon size={19} aria-hidden="true" /></span><h2>{title}</h2></div>
      <ul>{items.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>
    </section>
  );
}

export function generateStaticParams() {
  return LIBRARY_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: LibraryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getLibraryItemWithGuide(id);
  if (!item) return {};
  return { title: `${item.name} AI 工具资料`, description: item.descriptionZh };
}

export default async function LibraryDetailPage({ params }: LibraryDetailPageProps) {
  const { id } = await params;
  const item = getLibraryItemWithGuide(id);
  if (!item) notFound();
  const logoUrl = getLogoUrl(item.officialUrl);

  const signals = [
    ["中文友好", item.guide.isChineseFriendly],
    ["适合出海", item.guide.isGoodForGlobal],
    ["适合创作者", item.guide.isGoodForCreators],
    ["适合产品 / 开发", item.guide.isGoodForBuilders],
  ] as const;

  return (
    <main id="main-content" className="pixel-shell">
      <div className="pixel-content-stack">
        <nav className="pixel-breadcrumb" aria-label="面包屑">
          <Link href="/library"><ArrowLeft size={15} aria-hidden="true" /> AI 工具库</Link>
          <span>/</span><span aria-current="page">{item.name}</span>
        </nav>

        <section className="pixel-detail-hero">
          <div className="pixel-detail-identity">
            {logoUrl ? (
              <Image src={logoUrl} alt="" className="pixel-detail-logo" width={76} height={76} sizes="76px" unoptimized />
            ) : (
              <span className="pixel-detail-logo" aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</span>
            )}
            <div>
              <div className="pixel-detail-tags"><span>{item.category}</span><span>上手 {item.guide.difficulty}</span></div>
              <h1>{item.name}</h1>
              <p>{item.descriptionZh}</p>
            </div>
          </div>

          <div className="pixel-detail-score-block">
            <span>推荐指数</span><strong>{item.guide.recommendation}</strong><small>/ 100</small>
            <div><span style={{ width: `${item.guide.recommendation}%` }} /></div>
          </div>

          <div className="pixel-detail-actions">
            <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}><ArrowLeft size={16} aria-hidden="true" /> 返回工具库</Link>
            {item.officialUrl ? (
              <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })}>
                访问官网 <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </section>

        <section className="pixel-detail-audience" aria-labelledby="audience-heading">
          <div><Users size={18} aria-hidden="true" /><strong id="audience-heading">适合人群</strong></div>
          <div>{item.guide.audiences.map((audience) => <span key={audience}>{audience}</span>)}</div>
        </section>

        <div className="pixel-detail-grid">
          <DetailList title="最适合谁" items={item.guide.bestFor} icon={Compass} tone="blue" />
          <DetailList title="可能不适合" items={item.guide.notFor} icon={ShieldAlert} tone="red" />
          <DetailList title="典型使用场景" items={item.guide.useCases} icon={Lightbulb} tone="yellow" />
          <DetailList title="可以对比的工具" items={item.guide.alternatives} icon={ExternalLink} tone="purple" />
        </div>

        <section className="pixel-signal-card">
          <div className="pixel-section-heading compact">
            <div><span className="pixel-kicker">DECISION SIGNALS</span><h2>选择判断</h2></div>
            <p>“一般”不代表不好，只说明它不是这个场景的优先选项。</p>
          </div>
          <div className="pixel-detail-signals">
            {signals.map(([label, positive]) => (
              <div key={label} className={positive ? "is-good" : ""}>
                {positive ? <CheckCircle2 size={19} aria-hidden="true" /> : <CircleMinus size={19} aria-hidden="true" />}
                <span>{label}</span><strong>{positive ? "适合" : "一般"}</strong>
              </div>
            ))}
          </div>
        </section>

        <aside className="pixel-source-card">
          <div><span className="pixel-kicker">SOURCE & METHOD</span><h2>资料来源与使用提醒</h2></div>
          <p>基础信息整理自 {item.sourceName}，推荐指数与中文导购由 Pixel AI Rank 按分类、人群和场景字段整理。正式采购或商用前，请再次核验官网价格、隐私和授权条款。</p>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">查看原始来源 <ArrowUpRight size={15} aria-hidden="true" /></a>
        </aside>
      </div>
    </main>
  );
}
