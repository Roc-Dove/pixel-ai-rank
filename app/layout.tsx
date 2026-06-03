import type { Metadata } from "next";
import { CommunityBanner } from "@/components/layout/CommunityBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pixel AI Rank",
    template: "%s | Pixel AI Rank",
  },
  description: "聚合多个来源的 AI 产品与 KOL 榜单，用像素风界面快速浏览最新排名。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SearchProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <CommunityBanner />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
