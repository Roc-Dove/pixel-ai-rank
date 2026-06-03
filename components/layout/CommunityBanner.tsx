"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function CommunityBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <aside className="pixel-header-community" aria-label="Pixel AI Club 社群二维码">
        <div className="pixel-header-community-copy">
          <span>AI 情报局</span>
          <strong>进群抓住 AI 新机会</strong>
          <small>工具爆款 · KOL 动向 · 出海线索</small>
        </div>

        <button type="button" className="pixel-header-community-qr" onClick={() => setIsOpen(true)} aria-label="放大 Pixel AI Club 微信群二维码">
          <Image src="/pixel-ai-club-qr-focus.jpg" alt="Pixel AI Club 微信群二维码" width={76} height={120} priority sizes="76px" />
        </button>
      </aside>

      {isOpen ? (
        <div className="pixel-qr-lightbox" role="dialog" aria-modal="true" aria-label="Pixel AI Club 微信群二维码">
          <button type="button" className="pixel-qr-lightbox-backdrop" onClick={() => setIsOpen(false)} aria-label="关闭二维码放大图" />
          <div className="pixel-qr-lightbox-card">
            <button type="button" className="pixel-qr-lightbox-close" onClick={() => setIsOpen(false)} aria-label="关闭">
              ×
            </button>
            <Image src="/pixel-ai-club-qr-focus.jpg" alt="Pixel AI Club 微信群二维码放大图" width={430} height={680} priority sizes="(max-width: 640px) 82vw, 430px" />
            <p>微信扫码加入 Pixel AI Club，和 AI 爱好者、从业者一起发现工具、KOL 与趋势。</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
