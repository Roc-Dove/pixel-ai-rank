export type MainstreamProduct = {
  id: string;
  name: string;
  company: string;
  productUrl: string;
  sourceUrl: string;
  category: string;
  tagline: string;
  bestFor: string;
  productShape: string;
  entryModel: string;
  accent: string;
};

export type IndieProduct = {
  id: string;
  name: string;
  maker: string;
  origin: string;
  productUrl: string;
  sourceUrl: string;
  category: string;
  tagline: string;
  bestFor: string;
  teamLabel: string;
  businessModel: string;
  globalSignal: string;
  accent: string;
};

export const GLOBAL_PRODUCTS_LAST_VERIFIED = "2026-08-03";

export const MAINSTREAM_AI_PRODUCTS: readonly MainstreamProduct[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    productUrl: "https://chatgpt.com/",
    sourceUrl: "https://chatgpt.com/overview/",
    category: "通用 AI 助手",
    tagline: "把写作、研究、编程、图像和文件分析收进同一个对话入口。",
    bestFor: "个人到企业的通用工作流",
    productShape: "一个入口，多种任务",
    entryModel: "免费入口 · 个人与团队订阅",
    accent: "#10a37f",
  },
  {
    id: "claude",
    name: "Claude",
    company: "Anthropic",
    productUrl: "https://claude.ai",
    sourceUrl: "https://claude.com/product/overview",
    category: "思考与创作",
    tagline: "围绕长文档、复杂推理、写作和代码建立清晰的协作体验。",
    bestFor: "知识工作与复杂任务",
    productShape: "对话 + 项目 + 工具连接",
    entryModel: "免费入口 · 个人与组织订阅",
    accent: "#d97757",
  },
  {
    id: "gemini",
    name: "Gemini",
    company: "Google",
    productUrl: "https://gemini.google.com",
    sourceUrl: "https://gemini.google/overview/",
    category: "多模态助手",
    tagline: "把搜索、深度研究与 Google 应用连接到统一的多模态体验。",
    bestFor: "Google 生态内的工作与学习",
    productShape: "助手 + 搜索 + 生态连接",
    entryModel: "免费入口 · 高级订阅",
    accent: "#4f7df3",
  },
  {
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    company: "Microsoft",
    productUrl: "https://copilot.microsoft.com",
    sourceUrl: "https://www.microsoft.com/en-us/microsoft-copilot/for-individuals/",
    category: "办公 AI",
    tagline: "从独立助手延伸到 Windows 与 Microsoft 365 的日常工作场景。",
    bestFor: "办公、搜索与企业协作",
    productShape: "助手 + 操作系统 + 办公套件",
    entryModel: "免费入口 · 个人与企业方案",
    accent: "#6b57d2",
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    company: "Adobe",
    productUrl: "https://firefly.adobe.com/",
    sourceUrl: "https://www.adobe.com/products/firefly.html",
    category: "生成式创意",
    tagline: "生成并编辑图像、视频、音频和矢量内容，再接入专业创作流程。",
    bestFor: "品牌、营销与专业创作者",
    productShape: "生成器 + 编辑器 + Creative Cloud",
    entryModel: "免费层 · 生成点数与订阅",
    accent: "#e43b55",
  },
  {
    id: "canva-magic-studio",
    name: "Canva AI",
    company: "Canva",
    productUrl: "https://www.canva.com/canva-ai/",
    sourceUrl: "https://www.canva.com/canva-ai/",
    category: "AI 设计与内容创作",
    tagline: "用模板、品牌资产和 AI 把设计、改写、翻译与多渠道发布连起来。",
    bestFor: "非设计师与增长团队",
    productShape: "AI 能力嵌入完整编辑器",
    entryModel: "免费入口 · 个人与团队订阅",
    accent: "#7b61ff",
  },
] as const;

export const INDIE_AI_PRODUCTS: readonly IndieProduct[] = [
  {
    id: "photo-ai",
    name: "Photo AI",
    maker: "Pieter Levels",
    origin: "荷兰创始人 · 全球在线交付",
    productUrl: "https://photoai.com",
    sourceUrl: "https://photoai.com/faq/who-created-photo-ai-meet-pieter-levels-the-founder-5465077",
    category: "AI 人像与视觉",
    tagline: "不靠摄影棚，在线生成个人写真、商品试穿与创作者视觉素材。",
    bestFor: "创作者、电商与个人品牌",
    teamLabel: "1 人独立运营",
    businessModel: "订阅 + 点数",
    globalSignal: "英文官网 · 在线自助购买",
    accent: "#e34b5f",
  },
  {
    id: "boltai",
    name: "BoltAI",
    maker: "Daniel Nguyen",
    origin: "Daniel Nguyen 创办 · 全球 Mac 用户",
    productUrl: "https://boltai.com",
    sourceUrl: "https://boltai.com/about",
    category: "桌面 AI 客户端",
    tagline: "把多家模型、本地文件与快捷指令放进原生 Mac 工作流。",
    bestFor: "开发者与重度 Mac 用户",
    teamLabel: "独立创始人主导",
    businessModel: "授权 + BYOK",
    globalSignal: "英文产品 · 本地优先 · 全球交付",
    accent: "#3478f6",
  },
  {
    id: "audiopen",
    name: "AudioPen",
    maker: "Louis Pereira",
    origin: "Louis Pereira 创办 · 多端全球产品",
    productUrl: "https://www.audiopen.ai",
    sourceUrl: "https://www.audiopen.ai/faq",
    category: "语音写作",
    tagline: "把随口说出的想法整理成结构清楚、保留个人语气的文字。",
    bestFor: "写作者、顾问与知识工作者",
    teamLabel: "独立创始人主导",
    businessModel: "免费层 + Prime 授权",
    globalSignal: "多语言 · Web、移动端与桌面端",
    accent: "#9a63e8",
  },
  {
    id: "orshot",
    name: "Orshot",
    maker: "Rishi Mohan",
    origin: "Rishi Mohan · 德国柏林",
    productUrl: "https://orshot.com",
    sourceUrl: "https://orshot.com/about",
    category: "视觉自动化 API",
    tagline: "设计一次模板，再通过 API、无代码工具或 Agent 批量生成品牌素材。",
    bestFor: "开发者、代理商与营销团队",
    teamLabel: "1 人构建 · 小规模运营",
    businessModel: "用量订阅",
    globalSignal: "API-first · 英文文档 · 全球 B2B",
    accent: "#ef8c2f",
  },
  {
    id: "typingmind",
    name: "TypingMind",
    maker: "Tony Dinh 创办 · TypingMind 团队",
    origin: "越南创始团队 · 全球用户",
    productUrl: "https://www.typingmind.com",
    sourceUrl: "https://news.tonydinh.com/p/jun-2023-how-i-work-with-employees",
    category: "多模型 AI 工作台",
    tagline: "用自己的 API Key 连接多家模型，并加入角色、插件与团队能力。",
    bestFor: "AI 重度用户与小团队",
    teamLabel: "创始人主导的小团队",
    businessModel: "个人授权 + 团队订阅 + BYOK",
    globalSignal: "英文产品 · 多模型 · 自助交付",
    accent: "#2f855a",
  },
  {
    id: "sitegpt",
    name: "SiteGPT",
    maker: "Bhanu Teja 与 Sai Dheeraj",
    origin: "印度创始团队 · 全球 B2B",
    productUrl: "https://sitegpt.ai",
    sourceUrl: "https://sitegpt.ai/blog/authors",
    category: "AI 客服与获客",
    tagline: "从网站和知识库训练客服助手，嵌入站点回答问题并承接线索。",
    bestFor: "SaaS、服务商与内容型网站",
    teamLabel: "两位联合创始人主导",
    businessModel: "B2B 订阅",
    globalSignal: "95+ 语言 · 自助嵌入 · 全球客户",
    accent: "#15a176",
  },
] as const;

export const INTERNATIONAL_PRODUCT_COUNT = MAINSTREAM_AI_PRODUCTS.length + INDIE_AI_PRODUCTS.length;
