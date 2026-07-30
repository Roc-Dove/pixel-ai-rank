import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/library/LibraryExplorer";
import { getLibraryCardItems } from "@/lib/library/guide";

export const metadata: Metadata = {
  title: "AI 工具库",
  description: "112 个中文 AI 工具资料，明确区分官方核验与社区聚合、个体导购与分类基线，并可按用途、人群和难度筛选。",
  alternates: {
    canonical: "/library",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function LibraryPage() {
  return <LibraryExplorer items={getLibraryCardItems()} />;
}
