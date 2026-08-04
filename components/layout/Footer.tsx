import Link from "next/link";
import { Database, Globe2, RefreshCw, Rss, ShieldCheck } from "lucide-react";
import { PixelMark } from "@/components/ui/PixelMark";

export function Footer() {
  return (
    <footer className="pixel-footer">
      <div className="pixel-footer-grid">
        <div className="pixel-footer-brand">
          <div className="pixel-footer-lockup">
            <PixelMark />
            <div>
              <strong>PIXEL AI RANK</strong>
              <span>AI 产品、KOL 与出海增长导航。</span>
            </div>
          </div>
          <p>为中国 AI 产品团队整理产品样本、中文与海外 KOL、可追溯的 OPC 案例，以及分发、支付、本地化和平台规则变化。</p>
        </div>

        <div className="pixel-footer-column">
          <span className="pixel-footer-heading">探索</span>
          <Link href="/rank/aicpb">国际 AI 产品</Link>
          <Link href="/library">AI 产品库</Link>
          <Link href="/rank/xhunt_cn">中文 KOL</Link>
          <Link href="/rank/xhunt_global">全球 KOL</Link>
          <Link href="/opc">AI 出海 OPC</Link>
          <Link href="/signals">出海观察</Link>
          <a href="/feed.xml"><Rss size={15} aria-hidden="true" />订阅 RSS</a>
        </div>

        <div className="pixel-footer-column">
          <span className="pixel-footer-heading">数据承诺</span>
          <span><RefreshCw size={15} aria-hidden="true" />观察条目均附原始来源与日期</span>
          <span><Database size={15} aria-hidden="true" />真实抓取与本站精选分开标识</span>
          <span><ShieldCheck size={15} aria-hidden="true" />事实与编辑判断分开呈现</span>
        </div>
      </div>
      <div className="pixel-footer-bottom">
        <span>© {new Date().getFullYear()} Pixel AI Rank</span>
        <span><Globe2 size={14} aria-hidden="true" /> Products, people and global growth.</span>
      </div>
    </footer>
  );
}
