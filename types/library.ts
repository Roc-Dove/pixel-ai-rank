export const LIBRARY_CATEGORIES = [
  "AI 助手",
  "AI 编程",
  "AI 搜索/研究",
  "AI Agent",
  "AI 写作",
  "AI 图片生成",
  "AI 图片编辑",
  "AI 视频生成",
  "AI PPT/演示",
  "AI 自动化",
  "AI 设计",
  "AI 营销/SEO",
  "AI 音频",
] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export type LibraryItem = {
  id: string;
  name: string;
  category: LibraryCategory;
  descriptionZh: string;
  officialUrl: string | null;
  tags: string[];
  sourceName: "AI Collection";
  sourceUrl: string;
};
