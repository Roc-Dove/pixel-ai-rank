import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  FileCheck2,
  Globe2,
  Languages,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { LibraryLogo } from "@/components/library/LibraryLogo";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { FEATURED_OPC_CASES, OPC_LAST_VERIFIED } from "@/lib/opc/items";
import { getRankPayload } from "@/lib/rank-data";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { formatSignalDate } from "@/lib/signals/utils";
import type { RankItemDto } from "@/types/rank";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "AI 产品、KOL 与出海观察",
  description: "面向中国 AI 产品团队，整理产品机会、KOL 传播与海外市场变化。",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const revalidate = 3600;

function KolPanel({
  eyebrow,
  title,
  href,
  linkLabel,
  items,
  language,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
  items: RankItemDto[];
  language: "zh" | "en";
}) {
  return (
    <article className={styles.kolPanel}>
      <header className={styles.panelHeader}>
        <div>
          <span>{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        <Link href={href} aria-label={linkLabel}>
          查看全部 <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <div className={styles.kolList}>
        {items.map((item) => (
          <a
            key={item.name}
            className={styles.kolCard}
            href={item.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`查看 ${item.name} 的公开主页`}
          >
            <ProfileAvatar className={styles.kolAvatar} imageUrl={item.logoUrl} name={item.name} profileUrl={item.externalLink} />
            <div>
              <strong>{item.name}</strong>
              <p lang={language}>{item.description ?? "AI 产品与行业观察"}</p>
            </div>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  );
}

export default async function HomePage() {
  const [productPayload, cnKolPayload, globalKolPayload] = await Promise.all([
    getRankPayload("aicpb"),
    getRankPayload("xhunt_cn"),
    getRankPayload("xhunt_global"),
  ]);

  const observations = SIGNAL_ITEMS.slice(0, 5);
  const libraryCount = getLibraryItemsWithGuide().length;
  const marketBriefs = observations.slice(0, 3);
  const leadObservation = observations[0];
  const secondaryObservations = observations.slice(1);
  const products = productPayload.items.slice(0, 6);
  const cnKols = cnKolPayload.items.slice(0, 3);
  const globalKols = globalKolPayload.items.slice(0, 3);
  const kolCount = cnKolPayload.items.length + globalKolPayload.items.length;

  return (
    <main id="main-content" className={styles.main} tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><Globe2 size={16} aria-hidden="true" /> PRODUCT × KOL × GLOBAL</span>
          <h1 id="home-hero-title">中国 AI 产品，<br /><span>如何走向全球。</span></h1>
          <p>产品机会、KOL 扩散与海外市场变化，放在同一张图里。</p>

          <div className={styles.heroActions}>
            <Link href="/signals" className={styles.primaryAction}>
              查看出海观察 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/rank/aicpb" className={styles.secondaryAction}>
              浏览出海产品
            </Link>
          </div>

          <div className={styles.coverage} aria-label="当前可浏览内容">
            <span><strong>{productPayload.items.length}</strong> 个出海产品</span>
            <span><strong>{kolCount}</strong> 位中外 KOL</span>
            <span><strong>{SIGNAL_ITEMS.length}</strong> 条来源观察</span>
          </div>
        </div>

        <aside className={styles.marketDesk} aria-labelledby="market-desk-title">
          <header>
            <div>
              <span>GLOBAL DESK</span>
              <h2 id="market-desk-title">本期市场观察</h2>
            </div>
            <small>核验至 {SIGNALS_LAST_VERIFIED.replaceAll("-", ".")}</small>
          </header>

          <ol className={styles.marketBriefList}>
            {marketBriefs.map((item, index) => (
              <li key={item.id}>
                <Link href={`/signals/${item.id}`}>
                  <span className={styles.briefIndex}>0{index + 1}</span>
                  <span className={styles.briefCopy}>
                    <span>{item.market} · {item.focus[0]}</span>
                    <strong>{item.title}</strong>
                  </span>
                  <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
                </Link>
              </li>
            ))}
          </ol>

          <footer>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>只展示可追溯的公司、日期与原始来源</span>
          </footer>
        </aside>
      </section>

      <section className={styles.section} aria-labelledby="paths-title">
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>THREE LENSES</span>
            <h2 id="paths-title">产品、传播者与市场</h2>
          </div>
          <p>三个入口，对应一支出海团队最常查看的三类信息。</p>
        </header>

        <div className={styles.pathGrid}>
          <Link href="/library" className={`${styles.pathCard} ${styles.productPath}`}>
            <header>
              <span className={styles.pathIcon}><Boxes size={22} aria-hidden="true" /></span>
              <span>{libraryCount} 个产品</span>
            </header>
            <div className={styles.logoCluster} aria-hidden="true">
              {products.slice(0, 4).map((item) => (
                <span key={item.name}><LibraryLogo name={item.name} officialUrl={item.externalLink} /></span>
              ))}
            </div>
            <div className={styles.pathCopy}>
              <h3>产品图谱</h3>
              <p>查看产品定位、适用人群与出海资料。</p>
            </div>
            <span className={styles.pathFooter}>进入产品库 <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>

          <Link href="/rank/xhunt_cn" className={`${styles.pathCard} ${styles.kolPath}`}>
            <header>
              <span className={styles.pathIcon}><UsersRound size={22} aria-hidden="true" /></span>
              <span>{kolCount} 位 KOL</span>
            </header>
            <div className={styles.avatarCluster} aria-label="中文与全球 KOL 样本">
              {[...cnKols.slice(0, 2), ...globalKols.slice(0, 2)].map((item) => (
                <ProfileAvatar
                  key={`${item.name}-path`}
                  className={`${styles.kolAvatar} ${styles.kolAvatarCompact}`}
                  imageUrl={item.logoUrl}
                  name={item.name}
                  profileUrl={item.externalLink}
                />
              ))}
            </div>
            <div className={styles.pathCopy}>
              <h3>KOL 观察</h3>
              <p>按中文与全球视角查看产品传播者。</p>
            </div>
            <span className={styles.pathFooter}>查看 KOL <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>

          <Link href="/signals" className={`${styles.pathCard} ${styles.globalPath}`}>
            <header>
              <span className={styles.pathIcon}><Globe2 size={22} aria-hidden="true" /></span>
              <span>{observations.length} 条本期观察</span>
            </header>
            <ul className={styles.pathSignalList} aria-label="本期出海观察样本">
              {marketBriefs.map((item) => (
                <li key={`${item.id}-path`}><span>{item.company}</span><strong>{item.tags[0] ?? item.category}</strong></li>
              ))}
            </ul>
            <div className={styles.pathCopy}>
              <h3>出海市场</h3>
              <p>聚焦成本、渠道、产品交付与全球变化。</p>
            </div>
            <span className={styles.pathFooter}>浏览市场观察 <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      {leadObservation ? (
        <section className={styles.section} aria-labelledby="observations-title">
          <header className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>GLOBAL WATCH</span>
              <h2 id="observations-title">最新出海观察</h2>
            </div>
            <p>从官方发布中筛出影响产品成本、渠道、开发与全球交付的变化。</p>
            <Link href="/signals" className={styles.sectionLink}>全部观察 <ArrowRight size={16} aria-hidden="true" /></Link>
          </header>

          <div className={styles.observationGrid}>
            <Link href={`/signals/${leadObservation.id}`} className={styles.leadObservation}>
              <div className={styles.leadCover}>
                <span>{leadObservation.company}</span>
                <time dateTime={leadObservation.date}>{formatSignalDate(leadObservation.date)}</time>
                <strong>{leadObservation.sourceLabel}</strong>
              </div>
              <div className={styles.leadBody}>
                <div className={styles.signalMeta}>
                  <span>{leadObservation.category}</span>
                  {leadObservation.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <h3>{leadObservation.title}</h3>
                <p>{leadObservation.summary}</p>
                <span className={styles.cardLink}>查看来源与解读 <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>

            <div className={styles.secondaryObservationGrid}>
              {secondaryObservations.map((item) => (
                <Link href={`/signals/${item.id}`} key={item.id} className={styles.secondaryObservation}>
                  <div className={styles.signalMeta}>
                    <span>{item.company}</span>
                    <time dateTime={item.date}>{formatSignalDate(item.date)}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <footer><span>{item.market}</span><ArrowRight size={16} aria-hidden="true" /></footer>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.section} aria-labelledby="kol-title">
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>KOL WATCH</span>
            <h2 id="kol-title">谁在塑造 AI 产品认知</h2>
          </div>
          <p>中文圈帮助理解本地传播，全球账号连接海外产品与开发者语境。</p>
        </header>

        <div className={styles.kolGrid}>
          <KolPanel
            eyebrow="CHINESE VOICES"
            title="中文 KOL"
            href="/rank/xhunt_cn"
            linkLabel="查看全部中文 KOL"
            items={cnKols}
            language="zh"
          />
          <KolPanel
            eyebrow="GLOBAL VOICES"
            title="Global KOL"
            href="/rank/xhunt_global"
            linkLabel="查看全部全球 KOL"
            items={globalKols}
            language="en"
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="opc-title">
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionEyebrow}>AI-NATIVE OPC</span>
            <h2 id="opc-title">四种已跑通的 AI 出海方向</h2>
          </div>
          <p>当前一人运营、公开结果和出海路径同时可追溯；收入均保留披露日期。</p>
          <Link href="/opc" className={styles.sectionLink}>查看 OPC 案例 <ArrowRight size={16} aria-hidden="true" /></Link>
        </header>

        <div className={styles.opcGrid}>
          {FEATURED_OPC_CASES.map((item) => (
            <article key={item.id} className={styles.opcCard}>
              <header>
                <a href={item.productUrl} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${item.name} 官网`}>
                  <span className={styles.opcLogo}><LibraryLogo name={item.name} officialUrl={item.productUrl} /></span>
                  <span><strong>{item.name}</strong><small>{item.founder}</small></span>
                </a>
                <span className={styles.opcStatus}>{item.statusLabel}</span>
              </header>

              <div className={styles.opcDirection}>{item.direction}<span>{item.founderRegion}</span></div>

              <div className={styles.opcMetric}>
                <strong>{item.resultValue}</strong>
                <span>{item.resultLabel}</span>
                <time dateTime={item.resultAsOf}>{item.resultAsOf.replaceAll("-", ".")}</time>
              </div>

              <div className={styles.opcRoute}>
                <span>{item.channels[0]}</span><ArrowRight size={14} aria-hidden="true" /><span>{item.businessModel}</span>
              </div>

              <footer>
                <span>{item.teamSummary}</span>
                <a href={item.resultEvidence.url} target="_blank" rel="noopener noreferrer">
                  {item.resultEvidence.label} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </footer>
            </article>
          ))}
        </div>

        <div className={styles.opcDisclosure}>
          <ShieldCheck size={16} aria-hidden="true" />
          <span>核验至 {OPC_LAST_VERIFIED.replaceAll("-", ".")}：创始人自报不等同于审计数据；一人公司与极小团队分开呈现。</span>
        </div>
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <header>
          <span>HOW WE READ THE MARKET</span>
          <h2 id="method-title">来源清楚，判断有边界。</h2>
          <p>收录数量不等于市场需求；编辑判断也不会伪装成精确分数。</p>
        </header>

        <div className={styles.methodGrid}>
          <article>
            <FileCheck2 size={23} aria-hidden="true" />
            <strong>产品资料</strong>
            <p>{productPayload.sourceLabel}，保留产品官网与公开说明。</p>
          </article>
          <article>
            <UsersRound size={23} aria-hidden="true" />
            <strong>KOL 名单</strong>
            <p>{cnKolPayload.sourceLabel}与{globalKolPayload.sourceLabel}分开呈现。</p>
          </article>
          <article>
            <Megaphone size={23} aria-hidden="true" />
            <strong>市场观察</strong>
            <p>官方发布、事实摘要与编辑解读明确分层。</p>
          </article>
          <article>
            <Languages size={23} aria-hidden="true" />
            <strong>全球语境</strong>
            <p>同时保留中文视角和海外一手信息。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
