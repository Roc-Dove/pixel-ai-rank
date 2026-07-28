"use client";

import Image from "next/image";
import { useState } from "react";

function getLogoUrl(officialUrl: string | null) {
  if (!officialUrl) return null;
  try {
    const url = new URL(officialUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function LibraryLogo({ name, officialUrl, variant = "card" }: { name: string; officialUrl: string | null; variant?: "card" | "detail" }) {
  const logoUrl = getLogoUrl(officialUrl);
  const [failed, setFailed] = useState(false);
  const isDetail = variant === "detail";
  const className = isDetail ? "pixel-detail-logo" : "pixel-logo";
  const size = isDetail ? 76 : 50;

  if (!logoUrl || failed) {
    return <span className={isDetail ? "pixel-detail-logo" : "pixel-logo-fallback"} aria-hidden="true">{initials(name)}</span>;
  }

  return (
    <Image
      src={logoUrl}
      alt=""
      className={className}
      width={size}
      height={size}
      sizes={`${size}px`}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
