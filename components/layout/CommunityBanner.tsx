import Image from "next/image";

export function CommunityBanner() {
  return (
    <aside className="pixel-header-community" aria-label="Pixel AI Club 社群二维码">
      <div className="pixel-header-community-copy">
        <span>AI 情报局</span>
        <strong>Pixel AI Club</strong>
        <small>工具 · KOL · 趋势</small>
      </div>

      <Image src="/pixel-ai-club-qr.jpg" alt="Pixel AI Club 微信群二维码" width={72} height={101} priority sizes="72px" />
    </aside>
  );
}
