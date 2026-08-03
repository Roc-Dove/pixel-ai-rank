import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/library/LibraryExplorer";
import { getLibraryCardItems } from "@/lib/library/guide";
import { SOCIAL_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 产品库",
  description: "按产品类别、适用人群与使用场景整理的 AI 产品资料，明确区分官方核验、社区聚合与编辑说明。",
  alternates: {
    canonical: "/library",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: { title: "AI 产品库", description: "按产品类别、适用人群与使用场景整理的 AI 产品资料。", url: "/library", images: [SOCIAL_IMAGE] },
};

export default function LibraryPage() {
  return <LibraryExplorer items={getLibraryCardItems()} />;
}
