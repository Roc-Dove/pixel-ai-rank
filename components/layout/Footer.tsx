import Link from "next/link";
import { Code2, Database, RefreshCw } from "lucide-react";
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
              <span>把 AI 噪声整理成可行动的清单。</span>
            </div>
          </div>
          <p>产品榜、KOL 信号与中文 AI 工具导购。数据来源、降级状态和算法口径都会明确标注。</p>
        </div>

        <div className="pixel-footer-column">
          <span className="pixel-footer-heading">探索</span>
          <Link href="/">产品总览</Link>
          <Link href="/rank/aicpb">AI 排行榜</Link>
          <Link href="/library">AI 工具库</Link>
        </div>

        <div className="pixel-footer-column">
          <span className="pixel-footer-heading">数据承诺</span>
          <span><Database size={15} aria-hidden="true" />真实抓取与本站精选分开标识</span>
          <span><RefreshCw size={15} aria-hidden="true" />外部榜单计划每 48 小时更新</span>
          <span><Code2 size={15} aria-hidden="true" />Next.js + Prisma 数据架构</span>
        </div>
      </div>
      <div className="pixel-footer-bottom">
        <span>© {new Date().getFullYear()} Pixel AI Rank</span>
        <span>Made for clearer AI decisions.</span>
      </div>
    </footer>
  );
}
