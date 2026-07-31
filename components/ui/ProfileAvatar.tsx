"use client";

import Image from "next/image";
import { useState } from "react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

function avatarUrl(profileUrl: string) {
  try {
    const url = new URL(profileUrl);
    const handle = url.pathname.split("/").filter(Boolean)[0];
    if ((url.hostname === "x.com" || url.hostname === "twitter.com") && handle) {
      return `https://unavatar.io/x/${handle}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function ProfileAvatar({
  className,
  imageUrl,
  name,
  profileUrl,
}: {
  className?: string;
  imageUrl?: string | null;
  name: string;
  profileUrl: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : imageUrl || avatarUrl(profileUrl);

  return (
    <span className={className} role="img" aria-label={`${name} 头像`}>
      {src ? (
        <Image
          src={src}
          alt=""
          width={96}
          height={96}
          sizes="64px"
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : initials(name)}
    </span>
  );
}
