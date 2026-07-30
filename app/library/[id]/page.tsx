import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, CircleMinus, Compass, ExternalLink, Lightbulb, Radio, ShieldAlert, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemWithGuide } from "@/lib/library/guide";
import { LIBRARY_ITEMS } from "@/lib/library/items";
import { absoluteUrl } from "@/lib/site";

type LibraryDetailPageProps = { params: Promise<{ id: string }> };

function DetailList({
  title,
  items,
  icon: Icon,
  tone,
  itemLinks,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  tone: string;
  itemLinks?: Record<string, string>;
}) {
  return (
    <section className={`pixel-detail-card tone-${tone}`}>
      <div className="pixel-detail-card-heading"><span><Icon size={19} aria-hidden="true" /></span><h2>{title}</h2></div>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Check size={16} aria-hidden="true" />
            {itemLinks?.[item] ? (
              <Link href={`/library/${itemLinks[item]}`}>{item}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            ) : <span>{item}</span>}
          </li>
        ))}
      </ul>
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
  return {
    title: `${item.name} AI 工具资料`,
    description: item.descriptionZh,
    alternates: {
      canonical: `/library/${item.id}`,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      title: `${item.name} AI 工具资料`,
      description: item.descriptionZh,
      type: "website",
      url: `/library/${item.id}`,
    },
  };
}

export default async function LibraryDetailPage({ params }: LibraryDetailPageProps) {
  const { id } = await params;
  const item = getLibraryItemWithGuide(id);
  if (!item) notFound();

  const signals = [
    ["中文友好", item.guide.isChineseFriendly],
    ["适合出海", item.guide.isGoodForGlobal],
    ["适合创作者", item.guide.isGoodForCreators],
    ["适合产品 / 开发", item.guide.isGoodForBuilders],
  ] as const;
  const sourceLabel = item.sourceTier === "official" ? "官方来源核验" : "社区聚合资料";
  const guideLabel = item.guideDepth === "individual" ? "个体导购" : "分类基线";
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.name,
    description: item.descriptionZh,
    applicationCategory: item.category,
    inLanguage: "zh-CN",
    url: absoluteUrl(`/library/${item.id}`),
    sameAs: item.officialUrl ?? item.sourceUrl,
  };
  const alternativeLinks = Object.fromEntries(LIBRARY_ITEMS.map((candidate) => [candidate.name, candidate.id]));

  return (
    <main id="main-content" className="pixel-shell" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="pixel-content-stack">
        <nav className="pixel-breadcrumb" aria-label="面包屑">
          <Link href="/library"><ArrowLeft size={15} aria-hidden="true" /> AI 工具库</Link>
          <span>/</span><span aria-current="page">{item.name}</span>
        </nav>

        <section className="pixel-detail-hero">
          <div className="pixel-detail-identity">
            <LibraryLogo name={item.name} officialUrl={item.officialUrl} variant="detail" />
            <div>
              <div className="pixel-detail-tags">
                <span>{item.category}</span>
                <span>上手 {item.guide.difficulty}</span>
                <span>{sourceLabel}{item.verifiedAt ? ` ${item.verifiedAt.replaceAll("-", ".")}` : ""}</span>
                <span>{guideLabel}</span>
              </div>
              <h1>{item.name}</h1>
              <p>{item.descriptionZh}</p>
            </div>
          </div>

          <div className="pixel-detail-score-block">
            <span>推荐指数 · {guideLabel}</span><strong>{item.guide.recommendation}</strong><small>/ 100</small>
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
          <DetailList title="可以对比的工具" items={item.guide.alternatives} icon={ExternalLink} tone="purple" itemLinks={alternativeLinks} />
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
          <p>
            基础信息整理自 {item.sourceName}{item.verifiedAt ? `，最近通过官方来源核验于 ${item.verifiedAt.replaceAll("-", ".")}` : "，当前属于社区聚合资料，尚待逐项官方复核"}。
            {item.guideDepth === "individual"
              ? " 推荐指数和“最适合谁”已加入该工具的个体化编辑判断。"
              : ` 当前推荐指数和适用判断沿用「${item.category}」分类基线，不代表已经完成单工具深度评测。`}
            正式采购前请再次核验价格、隐私和授权条款。
          </p>
          <div className="pixel-source-links">
            {item.latestSignalId ? <Link href={`/signals/${item.latestSignalId}`}><Radio size={15} aria-hidden="true" /> 查看近期动态</Link> : null}
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">查看原始来源 <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </aside>
      </div>
    </main>
  );
}
