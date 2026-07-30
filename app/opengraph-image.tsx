import { ImageResponse } from "next/og";
import { SIGNALS_LAST_VERIFIED } from "@/lib/signals/constants";

export const alt = "Pixel AI Rank — AI signals, rankings and tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d1526",
          color: "#f5f7fb",
          padding: "74px 82px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "#f5f7fb",
                color: "#0d1526",
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              P
            </div>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 800, letterSpacing: 4 }}>
              PIXEL AI RANK
            </div>
          </div>
          <div style={{ display: "flex", color: "#aab5c7", fontSize: 20, letterSpacing: 2 }}>
            VERIFIED {SIGNALS_LAST_VERIFIED.replaceAll("-", ".")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", color: "#8795ff", fontSize: 22, letterSpacing: 5 }}>
            SIGNALS, NOT NOISE
          </div>
          <div style={{ display: "flex", maxWidth: 980, fontSize: 78, fontWeight: 850, lineHeight: 1.03 }}>
            AI updates you can act on.
          </div>
          <div style={{ display: "flex", color: "#b5c0d2", fontSize: 27 }}>
            Official sources · Decision context · Chinese tool guides
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 12, height: 12, background: "#57d5aa", borderRadius: 3 }} />
          <div style={{ display: "flex", color: "#aab5c7", fontSize: 21 }}>
            pixel-ai-rank.online
          </div>
        </div>
      </div>
    ),
    size,
  );
}
