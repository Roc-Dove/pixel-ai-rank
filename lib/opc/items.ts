export type OpcStatus = "current" | "micro-team" | "historical";

export type OpcEvidence = {
  label: string;
  url: string;
  date: string;
  kind: "official" | "founder" | "interview" | "company";
};

export type OpcCase = {
  id: string;
  name: string;
  founder: string;
  founderRegion: string;
  productUrl: string;
  category: string;
  direction: string;
  status: OpcStatus;
  statusLabel: string;
  teamSummary: string;
  resultValue: string;
  resultLabel: string;
  resultAsOf: string;
  channels: string[];
  businessModel: string;
  takeaway: string;
  resultEvidence: OpcEvidence;
  teamEvidence: OpcEvidence;
};

export const OPC_LAST_VERIFIED = "2026-08-01";

export const OPC_CASES: readonly OpcCase[] = [
  {
    id: "photo-ai",
    name: "Photo AI",
    founder: "Pieter Levels",
    founderRegion: "荷兰 · 全球运营",
    productUrl: "https://photoai.com",
    category: "B2C · Creator",
    direction: "AI 人像与视觉订阅",
    status: "current",
    statusLabel: "当前一人运营",
    teamSummary: "1 位创始人 · 无投资人",
    resultValue: "$105K / 月",
    resultLabel: "创始人同时披露约 $80K 月利润",
    resultAsOf: "2026-03-06",
    channels: ["X / 公开构建", "场景长尾页"],
    businessModel: "订阅 + 点数",
    takeaway: "视觉结果天然跨语言，围绕职业、社媒与生活场景切出大量全球入口。",
    resultEvidence: {
      label: "创始人项目记录",
      url: "https://levels.io/projects/",
      date: "2026-03-06",
      kind: "founder",
    },
    teamEvidence: {
      label: "产品官方创始人说明",
      url: "https://photoai.com/faq/who-created-photo-ai-meet-pieter-levels-the-founder-5465077",
      date: "2026-08-01",
      kind: "official",
    },
  },
  {
    id: "boltai",
    name: "BoltAI",
    founder: "Daniel Nguyen",
    founderRegion: "越南 · 胡志明市",
    productUrl: "https://boltai.com",
    category: "Desktop · Prosumer",
    direction: "桌面 AI 客户端",
    status: "current",
    statusLabel: "当前一人运营",
    teamSummary: "1 位创始人 · 自筹盈利",
    resultValue: "$15K / 月",
    resultLabel: "7,000+ 付费客户",
    resultAsOf: "2025-01-08",
    channels: ["X", "产品口碑"],
    businessModel: "一次买断 + BYOK",
    takeaway: "本地优先和 BYOK 把推理成本交还用户，适合小团队做高毛利专业工具。",
    resultEvidence: {
      label: "创始人访谈",
      url: "https://www.highsignal.io/making-15k-a-month-from-an-ai-app/",
      date: "2025-01-08",
      kind: "interview",
    },
    teamEvidence: {
      label: "产品官方 About",
      url: "https://boltai.com/about",
      date: "2026-08-01",
      kind: "official",
    },
  },
  {
    id: "audiopen",
    name: "AudioPen",
    founder: "Louis Pereira",
    founderRegion: "印度 · Goa",
    productUrl: "https://audiopen.ai",
    category: "B2C · Productivity",
    direction: "多语种语音写作",
    status: "current",
    statusLabel: "当前一人运营",
    teamSummary: "1 位兼职创始人",
    resultValue: "$15K / 月",
    resultLabel: "约 20 万用户 · 5,000+ 付费",
    resultAsOf: "2025-12-11",
    channels: ["X / 社区", "免费产品口碑"],
    businessModel: "免费层 + 年度授权",
    takeaway: "把语音输入做成跨设备、跨语言的通用工作流，比单一内容生成更容易全球复用。",
    resultEvidence: {
      label: "创始人视频访谈",
      url: "https://www.starterstory.com/Louis",
      date: "2025-12-11",
      kind: "interview",
    },
    teamEvidence: {
      label: "产品官方 FAQ",
      url: "https://www.audiopen.ai/faq",
      date: "2026-08-01",
      kind: "official",
    },
  },
  {
    id: "orshot",
    name: "Orshot",
    founder: "Rishi Mohan",
    founderRegion: "印度创始人 · 柏林",
    productUrl: "https://orshot.com",
    category: "B2B · API",
    direction: "营销图像自动化 API",
    status: "current",
    statusLabel: "当前一人运营",
    teamSummary: "1 位创始人 · 无全职员工",
    resultValue: "$6.2K MRR",
    resultLabel: "5,000+ 用户 · 76 万+ 次渲染",
    resultAsOf: "2026-07-17",
    channels: ["SEO / 对比页", "免费小工具"],
    businessModel: "用量订阅",
    takeaway: "API 加 Make、Zapier 等集成，让小团队服务全球 B2B 客户而不陷入定制交付。",
    resultEvidence: {
      label: "案例访谈",
      url: "https://www.indiehackers.com/post/from-side-hustle-to-6-2k-mrr-how-rishi-mohan-scaled-orshot-solo-9da059ab96",
      date: "2026-07-17",
      kind: "interview",
    },
    teamEvidence: {
      label: "同一案例访谈",
      url: "https://www.indiehackers.com/post/from-side-hustle-to-6-2k-mrr-how-rishi-mohan-scaled-orshot-solo-9da059ab96",
      date: "2026-07-17",
      kind: "interview",
    },
  },
  {
    id: "sitegpt",
    name: "SiteGPT",
    founder: "Bhanu Teja 与 Dheeraj",
    founderRegion: "印度 · 两人团队",
    productUrl: "https://sitegpt.ai",
    category: "B2B · Support",
    direction: "多语种 AI 客服",
    status: "micro-team",
    statusLabel: "2 人极小团队",
    teamSummary: "2 位核心成员 · 完全自筹",
    resultValue: "$500K 累计",
    resultLabel: "135 家企业日常使用",
    resultAsOf: "2025-11-21",
    channels: ["工程化 SEO", "自助式转化"],
    businessModel: "B2B 订阅",
    takeaway: "高意图关键词和标准化自助交付，让两人团队也能覆盖全球企业客户。",
    resultEvidence: {
      label: "创始人披露",
      url: "https://www.linkedin.com/posts/pbteja1998_we-just-crossed-500k-in-lifetime-revenue-activity-7397602042841686016-1OWJ",
      date: "2025-11-21",
      kind: "founder",
    },
    teamEvidence: {
      label: "创始人团队披露",
      url: "https://www.linkedin.com/posts/pbteja1998_we-just-crossed-500k-in-lifetime-revenue-activity-7397602042841686016-1OWJ",
      date: "2025-11-21",
      kind: "founder",
    },
  },
  {
    id: "base44",
    name: "Base44",
    founder: "Maor Shlomo",
    founderRegion: "以色列 · 已并入 Wix",
    productUrl: "https://base44.com",
    category: "Platform · Vibe Coding",
    direction: "自然语言应用生成",
    status: "historical",
    statusLabel: "历史 OPC · 已收购",
    teamSummary: "一人完成早期验证 · 收购前开始组队",
    resultValue: "$80M",
    resultLabel: "Wix 初始收购对价",
    resultAsOf: "2025-06-18",
    channels: ["公开构建", "产品内生传播"],
    businessModel: "平台订阅",
    takeaway: "一人可以快速验证新品类；进入平台级竞争后，分发、算力与组织规模仍会成为边界。",
    resultEvidence: {
      label: "Wix 公司公告",
      url: "https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif",
      date: "2025-06-18",
      kind: "company",
    },
    teamEvidence: {
      label: "创始人回顾访谈",
      url: "https://www.inc.com/ben-sherry/vibe-coding-base44-wix-avishai-abrahami-maor-shlomo/91267959",
      date: "2025-12-16",
      kind: "interview",
    },
  },
] as const;

export const FEATURED_OPC_CASES = OPC_CASES.filter((item) => item.status === "current").slice(0, 4);
