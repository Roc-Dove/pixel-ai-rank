import Link from "next/link";
import { ArrowRight, BookOpenCheck, Database, LibraryBig, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { RankTypeIcon } from "@/components/rank/RankTypeIcon";
import { pixelButtonClassName } from "@/components/ui/PixelButton";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";
import { LIBRARY_CATEGORIES } from "@/types/library";

export default function HomePage() {
  const libraryItems = getLibraryItemsWithGuide();
  const topTools = [...libraryItems]
    .filter((item) => item.officialUrl)
    .sort((left, right) => right.guide.recommendation - left.guide.recommendation || left.name.localeCompare(right.name))
    .slice(0, 6);

  return (
    <main id="main-content" className="pixel-home">
      <section className="pixel-home-hero">
        <div className="pixel-home-hero-copy">
          <span className="pixel-kicker"><Radar size={16} aria-hidden="true" /> AI SIGNAL DESK</span>
          <h1>把 AI 的噪声，<br /><span>排成能行动的清单。</span></h1>
          <p>
            不再追逐每一个新品。Pixel AI Rank 把产品榜、KOL 信号和中文工具导购放进同一套清晰、可核验的发现系统。
          </p>
          <div className="pixel-home-actions">
            <Link href="/rank/aicpb" className={pixelButtonClassName({ tone: "blue" })}>
              查看排行榜 <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/library" className={pixelButtonClassName({ tone: "ghost" })}>
              浏览工具库
            </Link>
          </div>
          <div className="pixel-home-trust">
            <span><ShieldCheck size={16} aria-hidden="true" /> 明确标注数据模式</span>
            <span><Database size={16} aria-hidden="true" /> 抓取失败自动降级</span>
            <span><BookOpenCheck size={16} aria-hidden="true" /> 中文场景化导购</span>
          </div>
        </div>

        <div className="pixel-home-radar" aria-label="高推荐 AI 工具预览">
          <div className="pixel-radar-header">
            <div>
              <span className="pixel-live-dot" aria-hidden="true" />
              <strong>HIGH SIGNAL</strong>
            </div>
            <span>TOP PICKS</span>
          </div>
          <div className="pixel-radar-list">
            {topTools.slice(0, 3).map((item, index) => (
              <Link href={`/library/${item.id}`} key={item.id} className="pixel-radar-item">
                <span className="pixel-radar-rank">0{index + 1}</span>
                <span className="pixel-radar-tool">
                  <strong>{item.name}</strong>
                  <small>{item.category}</small>
                </span>
                <span className="pixel-radar-score">{item.guide.recommendation}</span>
              </Link>
            ))}
          </div>
          <div className="pixel-radar-footer">
            <span>推荐指数</span>
            <div><span style={{ width: "94%" }} /></div>
            <span>持续维护</span>
          </div>
        </div>
      </section>

      <section className="pixel-home-stats" aria-label="内容规模">
        <div><strong>{libraryItems.length}</strong><span>精选 AI 工具</span></div>
        <div><strong>{LIBRARY_CATEGORIES.length}</strong><span>实用分类</span></div>
        <div><strong>5</strong><span>产品与 KOL 榜</span></div>
        <div><strong>48h</strong><span>外部榜更新计划</span></div>
      </section>

      <section className="pixel-home-section">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker">START HERE</span>
            <h2>按你的问题进入</h2>
          </div>
          <p>先确定你要做的决定，再选择数据入口。</p>
        </div>

        <div className="pixel-entry-grid">
          <Link href="/rank/aicpb" className="pixel-entry-card tone-red">
            <span className="pixel-entry-icon"><RankTypeIcon type="aicpb" size={24} /></span>
            <span className="pixel-entry-index">01</span>
            <h3>找出海机会</h3>
            <p>从适合海外市场和英文用户的 AI 产品开始，比较推荐指数与场景适配。</p>
            <span className="pixel-entry-link">打开出海榜 <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link href="/library" className="pixel-entry-card tone-blue">
            <span className="pixel-entry-icon"><LibraryBig size={24} strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="pixel-entry-index">02</span>
            <h3>选一款能用的工具</h3>
            <p>按人群、用途、上手难度和中文友好度筛选，不止看一句产品介绍。</p>
            <span className="pixel-entry-link">进入 AI 工具库 <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link href="/rank/xhunt_global" className="pixel-entry-card tone-purple">
            <span className="pixel-entry-icon"><RankTypeIcon type="xhunt_global" size={24} /></span>
            <span className="pixel-entry-index">03</span>
            <h3>跟踪高信号的人</h3>
            <p>同时查看中文与全球 AI 创作者，建立比信息流更稳定的信号源。</p>
            <span className="pixel-entry-link">查看全球 KOL <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      <section className="pixel-home-section pixel-home-picks">
        <div className="pixel-section-heading">
          <div>
            <span className="pixel-kicker"><Sparkles size={15} aria-hidden="true" /> EDITOR&apos;S RADAR</span>
            <h2>高推荐工具，先看这 6 个</h2>
          </div>
          <Link href="/library">查看全部 {libraryItems.length} 个 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <div className="pixel-picks-grid">
          {topTools.map((item, index) => (
            <Link href={`/library/${item.id}`} key={item.id} className="pixel-pick-card">
              <div className="pixel-pick-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.category}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.descriptionZh}</p>
              <div className="pixel-pick-footer">
                <span>推荐指数</span>
                <strong>{item.guide.recommendation}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pixel-method-section">
        <div>
          <span className="pixel-kicker">HOW IT WORKS</span>
          <h2>排名不是结论，<br />是更好的起点。</h2>
        </div>
        <ol className="pixel-method-list">
          <li><span>01</span><div><strong>区分来源</strong><p>真实抓取、本站算法精选和演示降级会明确标注，避免把模拟数据当实时排名。</p></div></li>
          <li><span>02</span><div><strong>补足语境</strong><p>工具不只给分数，还说明适合谁、典型场景、上手难度和替代选择。</p></div></li>
          <li><span>03</span><div><strong>保留判断</strong><p>数据源短暂不可用时继续提供可浏览的精选内容，同时保留状态说明和恢复路径。</p></div></li>
        </ol>
      </section>
    </main>
  );
}
