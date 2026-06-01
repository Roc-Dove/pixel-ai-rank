import { LibraryExplorer } from "@/components/library/LibraryExplorer";
import { LIBRARY_ITEMS } from "@/lib/library/items";

export const metadata = {
  title: "AI库",
  description: "按用途查找 AI 工具的中文精选库。",
};

export default function LibraryPage() {
  return <LibraryExplorer items={LIBRARY_ITEMS} />;
}
