import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Pixel AI Rank｜AI 产品、KOL 与出海增长导航",
    template: "%s｜Pixel AI Rank",
  },
  description: SITE_DESCRIPTION,
  keywords: ["AI 产品出海", "AI 出海", "AI KOL", "海外增长", "AI 产品榜", "AI 产品库"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    title: "Pixel AI Rank｜全球主流 × Indie 出海",
    description: "发现真正面向国际用户的 AI 产品，也看个人与小团队如何服务全球市场。",
    locale: "zh_CN",
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    images: [{ url: "/og-international.png", width: 1200, height: 630, alt: "Pixel AI Rank 全球主流与 Indie 出海产品" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel AI Rank｜全球主流 × Indie 出海",
    description: "发现真正面向国际用户的 AI 产品。",
    images: ["/og-international.png"],
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "zh-CN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Script id="pixel-theme-bootstrap" strategy="beforeInteractive">{themeScript}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }}
        />
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
