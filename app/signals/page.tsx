import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Globe2, Rss, ShieldCheck } from "lucide-react";
import { SignalsExplorer } from "@/components/signals/SignalsExplorer";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { SOCIAL_IMAGE } from "@/lib/site";
import { SIGNAL_CATEGORIES } from "@/types/signal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "出海观察",
  description: "聚焦 AI 产品出海、海外 KOL 渠道、分发、支付、本地化与平台规则，所有条目均附原始来源。",
  alternates: {
    canonical: "/signals",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: { title: "出海观察", description: "聚焦 AI 产品出海、海外 KOL 渠道、分发、支付、本地化与平台规则。", url: "/signals", images: [SOCIAL_IMAGE] },
};

export const revalidate = 3600;

export default function SignalsPage() {
  const verifiedStamp = SIGNALS_LAST_VERIFIED.replaceAll("-", ".");
  const featured = SIGNAL_ITEMS.slice(0, 3);

  return (
    <main id="main-content" className="pixel-shell pixel-news-page" tabIndex={-1}>
      <div className="pixel-content-stack">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className="pixel-kicker"><Globe2 size={16} aria-hidden="true" /> PRODUCT × KOL × GLOBAL</span>
            <h1>只看与产品出海<br /><span>真正有关的变化。</span></h1>
            <p>跟踪海外分发、KOL 渠道、内容本地化、支付与商业化。模型新闻只有在改变产品进入市场的方式时才会出现。</p>
            <div className={styles.heroActions}>
              <a href="#latest-signals" className={pixelButtonClassName({ tone: "blue" })}>
                浏览出海观察 <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="/feed.xml" className={pixelButtonClassName({ tone: "ghost" })}>
                <Rss size={16} aria-hidden="true" /> 订阅 RSS
              </a>
            </div>
            <div className={styles.scope} aria-label="本站内容范围">
              {SIGNAL_CATEGORIES.map((category) => (
                <span key={category}><strong>{SIGNAL_ITEMS.filter((item) => item.category === category).length}</strong>{category}</span>
              ))}
            </div>
          </div>

          <aside className={styles.watchboard} aria-label="最新海外市场观察">
            <header>
              <span><ShieldCheck size={15} aria-hidden="true" /> GLOBAL WATCH</span>
              <time dateTime={SIGNALS_LAST_VERIFIED}>{verifiedStamp}</time>
            </header>
            <div>
              {featured.map((item, index) => (
                <Link href={`/signals/${item.id}`} key={item.id}>
                  <span className={styles.index}>0{index + 1}</span>
                  <span className={styles.watchCopy}>
                    <small>{item.market} · {item.category}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <footer>仅整理官方、平台或当事方原始资料</footer>
          </aside>
        </section>

        <section id="latest-signals" className="pixel-news-feed">
          <div className="pixel-section-heading">
            <div>
              <span className="pixel-kicker"><CalendarDays size={15} aria-hidden="true" /> VERIFIED {verifiedStamp}</span>
              <h2>近期出海观察</h2>
            </div>
            <p><ShieldCheck size={15} aria-hidden="true" /> 事实、案例与编辑判断分开标注</p>
          </div>
          <SignalsExplorer items={SIGNAL_ITEMS} />
        </section>
      </div>
    </main>
  );
}
