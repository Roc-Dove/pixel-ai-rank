import Link from "next/link";
import { notFound } from "next/navigation";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemWithGuide } from "@/lib/library/guide";
import { LIBRARY_ITEMS } from "@/lib/library/items";

type LibraryDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getLogoUrl(officialUrl: string | null) {
  if (!officialUrl) return null;

  try {
    const url = new URL(officialUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="pixel-detail-card">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function generateStaticParams() {
  return LIBRARY_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: LibraryDetailPageProps) {
  const { id } = await params;
  const item = getLibraryItemWithGuide(id);
  if (!item) return {};

  return {
    title: `${item.name} AI工具资料`,
    description: item.descriptionZh,
  };
}

export default async function LibraryDetailPage({ params }: LibraryDetailPageProps) {
  const { id } = await params;
  const item = getLibraryItemWithGuide(id);
  if (!item) notFound();

  const logoUrl = getLogoUrl(item.officialUrl);

  return (
    <main className="pixel-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="pixel-panel pixel-detail-hero">
          <div className="flex min-w-0 items-start gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="pixel-detail-logo" />
            ) : (
              <span className="pixel-detail-logo">{item.name.slice(0, 2).toUpperCase()}</span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pixel-hero-eyebrow purple">{item.category}</span>
                <span className="pixel-chip blue">推荐 / {item.guide.recommendation}</span>
                <span className="pixel-chip green">上手 / {item.guide.difficulty}</span>
              </div>
              <h1 className="pixel-detail-title">{item.name}</h1>
              <p className="pixel-hero-summary">{item.descriptionZh}</p>
            </div>
          </div>

          <div className="pixel-detail-actions">
            <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}>
              返回AI库
            </Link>
            {item.officialUrl ? (
              <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })}>
                <span aria-hidden="true">↗</span>
                <span>访问官网</span>
              </a>
            ) : null}
          </div>
        </section>

        <section className="pixel-detail-strip" aria-label="适合人群">
          {item.guide.audiences.map((audience) => (
            <span key={audience}>{audience}</span>
          ))}
        </section>

        <div className="pixel-detail-grid">
          <DetailList title="适合谁" items={item.guide.bestFor} />
          <DetailList title="不适合谁" items={item.guide.notFor} />
          <DetailList title="典型使用场景" items={item.guide.useCases} />
          <DetailList title="可替代工具" items={item.guide.alternatives} />
        </div>

        <section className="pixel-detail-card">
          <h2>选择判断</h2>
          <div className="pixel-detail-signals">
            <span className={item.guide.isChineseFriendly ? "is-good" : ""}>中文友好：{item.guide.isChineseFriendly ? "是" : "一般"}</span>
            <span className={item.guide.isGoodForGlobal ? "is-good" : ""}>适合出海：{item.guide.isGoodForGlobal ? "是" : "一般"}</span>
            <span className={item.guide.isGoodForCreators ? "is-good" : ""}>适合创作者：{item.guide.isGoodForCreators ? "是" : "一般"}</span>
            <span className={item.guide.isGoodForBuilders ? "is-good" : ""}>适合产品/创业者：{item.guide.isGoodForBuilders ? "是" : "一般"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
