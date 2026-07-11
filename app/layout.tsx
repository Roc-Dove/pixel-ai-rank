import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const themeScript = `
  try {
    const stored = localStorage.getItem("pixel-ai-rank-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
  } catch {}
`;

export const metadata: Metadata = {
  title: {
    default: "Pixel AI Rank｜AI 排行榜与中文工具库",
    template: "%s｜Pixel AI Rank",
  },
  description: "聚合 AI 产品榜、KOL 信号与 100+ 中文 AI 工具导购，明确标注真实抓取、本站精选和降级数据。",
  keywords: ["AI 排行榜", "AI 工具", "AI 导航", "AI KOL", "出海工具"],
  openGraph: {
    title: "Pixel AI Rank",
    description: "把 AI 噪声整理成可行动的清单。",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Script id="pixel-theme-bootstrap" strategy="beforeInteractive">{themeScript}</Script>
        <a className="pixel-skip-link" href="#main-content">跳到主要内容</a>
        <ThemeProvider>
          <SearchProvider>
            <div className="pixel-app-shell">
              <Header />
              <div className="pixel-page-slot">{children}</div>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
