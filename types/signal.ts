export const SIGNAL_CATEGORIES = [
  "产品",
  "KOL",
  "出海",
] as const;

export type SignalCategory = (typeof SIGNAL_CATEGORIES)[number];

export const SIGNAL_IMPACTS = ["平台与规则", "产品案例", "KOL 与渠道"] as const;

export type SignalImpact = (typeof SIGNAL_IMPACTS)[number];

export type SignalAvailability = "open" | "ongoing" | "retired";

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
  market: string;
  focus: string[];
  applicableTo: string[];
  featured?: boolean;
  deadline?: string;
  availability?: SignalAvailability;
  actionLabel?: string;
};
