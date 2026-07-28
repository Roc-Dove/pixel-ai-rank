import { LibraryExplorer } from "@/components/library/LibraryExplorer";
import { getLibraryItemsWithGuide } from "@/lib/library/guide";

export const metadata = {
  title: "AI 工具库",
  description: "112 个近期维护的中文 AI 工具资料，按用途、人群、难度和推荐指数筛选，并链接官方来源与最新动态。",
};

export default function LibraryPage() {
  return <LibraryExplorer items={getLibraryItemsWithGuide()} />;
}
