export const SIGNAL_CATEGORIES = [
  "模型升级",
  "Agent",
  "AI 编程",
  "多模态",
  "产品变更",
  "安全与产业",
] as const;

export type SignalCategory = (typeof SIGNAL_CATEGORIES)[number];

export const SIGNAL_IMPACTS = ["立即行动", "重点关注", "持续观察"] as const;

export type SignalImpact = (typeof SIGNAL_IMPACTS)[number];

export type SignalItem = {
  id: string;
  title: string;
  company: string;
  date: string;
  category: SignalCategory;
  impact: SignalImpact;
  summary: string;
  whyItMatters: string;
  nextStep: string;
  facts: string[];
  tags: string[];
  sourceLabel: string;
  sourceUrl: string;
  relatedToolIds: string[];
  featured?: boolean;
  deadline?: string;
};
