import Image from "next/image";

export function CommunityBanner() {
  return (
    <section className="pixel-community-band" aria-label="Pixel AI Club 社群二维码">
      <div className="pixel-community-inner">
        <div className="pixel-community-copy">
          <span className="pixel-community-kicker">JOIN COMMUNITY</span>
          <h2>加入 AI 情报局</h2>
          <p>Pixel AI Club：给 AI 爱好者与从业者的工具、KOL 和趋势社群。</p>
          <div className="pixel-community-tags" aria-label="社群内容">
            <span>AI 工具发现</span>
            <span>KOL 观察</span>
            <span>榜单线索</span>
            <span>行业趋势</span>
          </div>
        </div>

        <figure className="pixel-community-qr">
          <Image src="/pixel-ai-club-qr.jpg" alt="Pixel AI Club 微信群二维码" width={236} height={332} priority sizes="(max-width: 640px) 180px, 236px" />
          <figcaption>微信扫码加入 Pixel AI Club</figcaption>
        </figure>
      </div>
    </section>
  );
}
