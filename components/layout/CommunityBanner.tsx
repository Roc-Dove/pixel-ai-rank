"use client";

import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function CommunityBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const backgroundNodes = document.querySelectorAll<HTMLElement>(
      ".pixel-brand, .pixel-site-nav, .pixel-icon-button, .pixel-header-search-row, .pixel-page-slot, .pixel-footer",
    );
    document.body.style.overflow = "hidden";
    backgroundNodes.forEach((node) => node.setAttribute("inert", ""));
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      backgroundNodes.forEach((node) => node.removeAttribute("inert"));
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDialog, isOpen]);

  return (
    <>
      <button ref={triggerRef} type="button" className="pixel-community-trigger" onClick={() => setIsOpen(true)} aria-label="加入 Pixel AI 社群">
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>加入社群</span>
      </button>

      {isOpen ? (
        <div className="pixel-qr-lightbox" role="dialog" aria-modal="true" aria-labelledby="community-dialog-title">
          <button type="button" className="pixel-qr-lightbox-backdrop" onClick={closeDialog} aria-label="关闭社群二维码" tabIndex={-1} />
          <div className="pixel-qr-lightbox-card">
            <button ref={closeButtonRef} type="button" className="pixel-qr-lightbox-close" onClick={closeDialog} aria-label="关闭">
              <X size={20} aria-hidden="true" />
            </button>
            <div className="pixel-community-dialog-copy">
              <span className="pixel-kicker">PIXEL AI CLUB</span>
              <h2 id="community-dialog-title">和同频的人一起筛信号</h2>
              <p>工具爆款、KOL 动向和出海线索，会比榜单更早一步出现在社群里。</p>
            </div>
            <div className="pixel-community-qr-frame">
              <Image src="/pixel-ai-club-qr-focus.jpg" alt="Pixel AI Club 微信群二维码" width={430} height={680} sizes="(max-width: 640px) 72vw, 310px" />
            </div>
            <p className="pixel-community-dialog-note">微信扫码加入 · 二维码失效时可稍后再试</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
