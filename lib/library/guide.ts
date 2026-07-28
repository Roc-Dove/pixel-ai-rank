import { LIBRARY_ITEMS } from "@/lib/library/items";
import { type LibraryAudience, type LibraryCategory, type LibraryDifficulty, type LibraryGuide, type LibraryItem, type LibraryItemWithGuide } from "@/types/library";

type CategoryGuide = Omit<LibraryGuide, "alternatives">;
type GuideOverride = Partial<LibraryGuide>;

const CATEGORY_GUIDES: Record<LibraryCategory, CategoryGuide> = {
  "AI 助手": {
    recommendation: 94,
    difficulty: "低",
    audiences: ["普通用户", "创业者/产品经理", "内容创作者", "出海团队", "开发者"],
    bestFor: ["需要一个通用 AI 入口的人", "想快速完成写作、问答、总结和头脑风暴的团队", "还没有固定 AI 工作流的新用户"],
    notFor: ["需要非常垂直、强流程管控的企业系统", "要求所有数据完全本地化处理的高敏感场景"],
    useCases: ["日常问答与资料总结", "文案、邮件和方案初稿", "代码解释和学习辅助"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: true,
  },
  "AI 编程": {
    recommendation: 91,
    difficulty: "中",
    audiences: ["开发者", "创业者/产品经理"],
    bestFor: ["想快速做原型的开发者和产品团队", "需要理解代码库、生成组件或修 Bug 的工程团队", "希望把想法变成可运行应用的创业者"],
    notFor: ["完全不想接触代码和部署的人", "对工程质量没有验证流程的团队"],
    useCases: ["生成应用原型", "理解和重构代码", "补测试、修 Bug 和写组件"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: false,
    isGoodForBuilders: true,
  },
  "AI 搜索/研究": {
    recommendation: 90,
    difficulty: "低",
    audiences: ["普通用户", "创业者/产品经理", "内容创作者", "出海团队"],
    bestFor: ["需要快速理解一个新领域的人", "要做竞品、市场或论文资料梳理的团队", "希望答案带来源引用的研究场景"],
    notFor: ["只需要闲聊陪伴的用户", "不能接受结果需要二次核验的高风险决策"],
    useCases: ["竞品和市场研究", "论文与资料检索", "带来源的主题问答"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: true,
  },
  "AI Agent": {
    recommendation: 86,
    difficulty: "高",
    audiences: ["创业者/产品经理", "出海团队", "开发者"],
    bestFor: ["已经有明确重复流程的团队", "想把销售、运营、研究或开发任务自动化的人", "愿意花时间配置流程的业务负责人"],
    notFor: ["只想开箱即用、不愿配置流程的个人用户", "任务边界不清晰或容错率很低的场景"],
    useCases: ["多步骤任务执行", "销售和运营流程自动化", "网页、数据和工具链编排"],
    isChineseFriendly: false,
    isGoodForGlobal: true,
    isGoodForCreators: false,
    isGoodForBuilders: true,
  },
  "AI 写作": {
    recommendation: 84,
    difficulty: "低",
    audiences: ["普通用户", "内容创作者", "出海团队"],
    bestFor: ["需要持续产出文章、邮件、广告文案的人", "英文写作和品牌表达要求较高的团队", "内容营销和社媒运营人员"],
    notFor: ["希望完全替代人工判断和品牌策略的人", "需要高度原创文学表达的创作"],
    useCases: ["文案初稿", "英文润色", "邮件和社媒内容"],
    isChineseFriendly: false,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: false,
  },
  "AI 图片生成": {
    recommendation: 88,
    difficulty: "中",
    audiences: ["内容创作者", "创业者/产品经理", "出海团队"],
    bestFor: ["需要快速生成视觉概念和营销素材的人", "做品牌、海报、插画和社媒内容的创作者", "想低成本探索视觉方向的团队"],
    notFor: ["需要严格商用授权但不愿核验条款的团队", "要求完全可控、像素级精修的专业设计交付"],
    useCases: ["海报和社媒图", "产品视觉概念", "插画和创意探索"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: false,
  },
  "AI 图片编辑": {
    recommendation: 87,
    difficulty: "低",
    audiences: ["普通用户", "内容创作者", "出海团队"],
    bestFor: ["需要处理商品图、头像、海报和社媒素材的人", "电商和营销团队", "不想学习复杂修图软件的普通用户"],
    notFor: ["需要完整专业设计流程的高级设计师", "对细节和图层控制要求极高的场景"],
    useCases: ["抠图和背景替换", "商品图优化", "图片清理和放大"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: false,
  },
  "AI 视频生成": {
    recommendation: 89,
    difficulty: "中",
    audiences: ["内容创作者", "出海团队", "创业者/产品经理"],
    bestFor: ["需要短视频、广告片和产品演示素材的人", "想快速验证视频创意的团队", "需要数字人或多语言视频的出海业务"],
    notFor: ["需要电影级连续叙事和完全可控镜头的专业制作", "预算和审核流程非常严格的品牌项目"],
    useCases: ["短视频素材", "数字人培训和营销", "图生视频和概念片"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: false,
  },
  "AI PPT/演示": {
    recommendation: 85,
    difficulty: "低",
    audiences: ["普通用户", "创业者/产品经理", "出海团队"],
    bestFor: ["需要快速做路演、汇报和销售材料的人", "不想从空白页开始排版的团队", "频繁做提案和演示的人"],
    notFor: ["对品牌规范和动画细节要求极高的设计团队", "已经有成熟设计模板和制作流程的公司"],
    useCases: ["商业汇报", "销售材料", "课程和路演初稿"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: true,
  },
  "AI 自动化": {
    recommendation: 86,
    difficulty: "中",
    audiences: ["创业者/产品经理", "出海团队", "开发者"],
    bestFor: ["有明确重复流程的运营、销售和数据团队", "想把多个 SaaS 工具串起来的创业公司", "需要低代码自动化的人"],
    notFor: ["流程还不稳定、需求经常变化的早期探索", "没有人维护自动化规则的团队"],
    useCases: ["跨工具数据同步", "销售和运营自动化", "表单、邮件和 CRM 流程"],
    isChineseFriendly: false,
    isGoodForGlobal: true,
    isGoodForCreators: false,
    isGoodForBuilders: true,
  },
  "AI 设计": {
    recommendation: 84,
    difficulty: "中",
    audiences: ["创业者/产品经理", "内容创作者", "开发者"],
    bestFor: ["需要快速做原型、落地页或 UI 方向的人", "产品经理和创业团队", "希望提升设计起点的非专业设计者"],
    notFor: ["需要完整品牌系统和高级视觉规范的专业设计项目", "完全不想参与审美判断的人"],
    useCases: ["UI 原型", "落地页生成", "设计探索和线框图"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: true,
  },
  "AI 营销/SEO": {
    recommendation: 83,
    difficulty: "中",
    audiences: ["创业者/产品经理", "内容创作者", "出海团队"],
    bestFor: ["需要增长、SEO、社媒和广告素材的团队", "做海外市场和内容营销的业务", "想持续追踪关键词和竞品的人"],
    notFor: ["没有明确产品定位和目标用户的项目", "希望工具自动替代营销策略的人"],
    useCases: ["SEO 和关键词研究", "广告素材生成", "社媒内容和竞品分析"],
    isChineseFriendly: false,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: true,
  },
  "AI 音频": {
    recommendation: 85,
    difficulty: "低",
    audiences: ["内容创作者", "出海团队", "普通用户"],
    bestFor: ["需要配音、音乐、播客和多语言音频的人", "短视频和课程创作者", "想低成本生成声音素材的团队"],
    notFor: ["需要严格版权链路但不愿核验授权的人", "对真人表演情绪要求极高的专业项目"],
    useCases: ["AI 配音", "音乐和背景音", "播客录制与增强"],
    isChineseFriendly: true,
    isGoodForGlobal: true,
    isGoodForCreators: true,
    isGoodForBuilders: false,
  },
};

const DIFFICULTY_OVERRIDES: Record<string, LibraryDifficulty> = {
  chatgpt: "低",
  claude: "低",
  cursor: "中",
  "github-copilot": "中",
  n8n: "高",
  semrush: "中",
  ahrefs: "中",
};

const GUIDE_OVERRIDES: Record<string, GuideOverride> = {
  chatgpt: {
    recommendation: 98,
    bestFor: ["第一次系统使用 AI 的普通用户", "需要一个覆盖写作、学习、图片和代码的主力入口", "想把 AI 融入日常工作的团队"],
    alternatives: ["Claude", "Google Gemini", "Kimi"],
  },
  claude: {
    recommendation: 96,
    bestFor: ["经常处理长文档、方案和复杂推理的人", "重视文字质量和上下文稳定性的团队", "需要分析材料而不是只要短回答的用户"],
    alternatives: ["ChatGPT", "Google Gemini", "Kimi"],
  },
  gemini: {
    recommendation: 97,
    bestFor: ["深度使用 Google Workspace 和 Android 生态的用户", "需要长上下文、多模态与 Computer Use 的开发团队", "想在速度、成本和 Agent 能力之间取平衡的人"],
    alternatives: ["ChatGPT", "Claude", "Kimi"],
  },
  deepseek: {
    recommendation: 95,
    bestFor: ["需要中文、推理、代码和 API 性价比的团队", "愿意显式管理模型版本和迁移的开发者", "在国内模型生态中构建 Agent 的产品团队"],
    alternatives: ["Kimi", "Qwen Code", "Google Gemini"],
  },
  kimi: {
    recommendation: 96,
    bestFor: ["需要中文长文档、1M 上下文和多模态研究的人", "关注开放权重模型与本土工具链的开发团队", "要处理长时编程和知识工作的用户"],
    alternatives: ["Claude", "DeepSeek", "Google Gemini"],
  },
  grok: {
    recommendation: 95,
    bestFor: ["需要实时信息、代码与 Agent 能力的用户", "想在 Cursor 或 API 中评测 Grok 4.5 的开发团队", "需要追踪热点并继续执行知识工作的产品团队"],
    alternatives: ["ChatGPT", "Claude", "Google Gemini"],
  },
  cursor: {
    recommendation: 95,
    bestFor: ["已有代码项目、想让 AI 理解整个代码库的开发者", "想加速原型开发的小团队", "需要频繁重构和改 Bug 的工程师"],
    alternatives: ["Windsurf", "GitHub Copilot", "v0"],
  },
  "github-copilot": {
    recommendation: 95,
    bestFor: ["深度使用 GitHub 与 VS Code 的开发团队", "需要并行 Agent、独立工作台和浏览器验证的人", "希望把 Issue、代码、测试和 Pull Request 串起来的工程组织"],
    alternatives: ["OpenAI Codex", "Claude Code", "Cursor"],
  },
  "openai-codex": {
    recommendation: 97,
    bestFor: ["需要在桌面、CLI、IDE 和云端并行推进工程任务的开发者", "想把任务交给独立 Agent 并审查结果的团队", "使用 OpenAI 模型与工具链的工程组织"],
    alternatives: ["Claude Code", "GitHub Copilot", "Cursor"],
  },
  "claude-code": {
    recommendation: 97,
    bestFor: ["偏好终端与项目级 Agent 工作方式的开发者", "需要长时理解代码库、运行测试和迭代修复的团队", "希望并行管理多个工程会话的人"],
    alternatives: ["OpenAI Codex", "GitHub Copilot", "Qwen Code"],
  },
  "qwen-code": {
    recommendation: 93,
    bestFor: ["重视中文、本土模型渠道和开源可控性的开发团队", "需要实时纠偏与 worktree 隔离的人", "想自选模型和审查 Agent 执行边界的工程师"],
    alternatives: ["OpenCode", "Claude Code", "OpenAI Codex"],
  },
  opencode: {
    recommendation: 90,
    bestFor: ["希望在多个模型厂商之间自由切换的开发者", "重视开源、MCP 和本地工作流的团队", "需要终端与桌面双入口的人"],
    alternatives: ["Qwen Code", "OpenAI Codex", "Claude Code"],
  },
  "grok-build": {
    recommendation: 92,
    bestFor: ["要把大型工程任务拆给多个 Agent 的团队", "需要实验并行开发与任务编排的工程负责人", "已在评估 Grok 4.5 的开发者"],
    alternatives: ["OpenAI Codex", "Claude Code", "GitHub Copilot"],
  },
  perplexity: {
    recommendation: 94,
    bestFor: ["需要带来源的搜索答案的人", "做竞品、市场和资料研究的产品经理", "想快速理解新领域的内容创作者"],
    alternatives: ["Genspark", "You.com", "NotebookLM"],
  },
  midjourney: {
    recommendation: 93,
    bestFor: ["追求高质量视觉风格的创作者", "需要概念图、插画和广告视觉的人", "愿意花时间调提示词的人"],
    alternatives: ["Ideogram", "Leonardo AI", "Adobe Firefly"],
  },
  runway: {
    recommendation: 93,
    bestFor: ["需要 AI 视频创意和动态视觉的团队", "广告和内容创作者", "想快速探索视频镜头的人"],
    alternatives: ["Pika", "Luma AI", "Kling AI"],
  },
  gamma: {
    recommendation: 92,
    bestFor: ["需要快速做汇报、提案和演示的人", "重视页面观感但不想手动排版的团队", "需要从文档快速变成演示稿的用户"],
    alternatives: ["Beautiful.ai", "Pitch", "Presentations.AI"],
  },
  zapier: {
    recommendation: 90,
    bestFor: ["使用很多 SaaS 工具的团队", "需要把线索、表单、邮件和 CRM 串起来的人", "想少写代码做自动化的运营团队"],
    alternatives: ["Make", "n8n", "Relay.app"],
  },
  "kimi-work": {
    recommendation: 94,
    bestFor: ["需要处理本地文件和桌面应用的中文团队", "想把资料整理与周期报告交给后台任务的人", "愿意从低风险、可回滚流程开始部署 Agent 的用户"],
    alternatives: ["Perplexity Computer", "Meta AI", "Manus"],
  },
  "meta-ai": {
    recommendation: 93,
    bestFor: ["想用个人 AI 助手处理研究、演示和日程的人", "需要可在执行中实时纠偏的任务 Agent 用户", "已在 Meta 生态中工作和创作的人"],
    alternatives: ["Kimi Work", "Perplexity Computer", "ChatGPT"],
  },
  "perplexity-computer": {
    recommendation: 91,
    bestFor: ["需要连接应用、持续记忆和并行子 Agent 的知识工作者", "想在隔离云沙箱中完成多步骤任务的团队", "已有明确数字员工工作流的产品负责人"],
    alternatives: ["Kimi Work", "Manus", "Genspark"],
  },
  "nano-banana-2": {
    recommendation: 91,
    bestFor: ["需要低成本批量生成商品图和社媒素材的团队", "希望快速迭代视觉方向的内容创作者", "已经在 Google AI 生态中搭建媒体流水线的人"],
    alternatives: ["GPT Image 2", "Midjourney", "Adobe Firefly"],
  },
};

function alternativesFor(item: LibraryItem) {
  return LIBRARY_ITEMS.filter((candidate) => candidate.category === item.category && candidate.id !== item.id)
    .slice(0, 3)
    .map((candidate) => candidate.name);
}

function dedupe<T>(values: T[]) {
  return Array.from(new Set(values));
}

export function getLibraryGuide(item: LibraryItem): LibraryGuide {
  const base = CATEGORY_GUIDES[item.category];
  const override = GUIDE_OVERRIDES[item.id] ?? {};

  return {
    ...base,
    ...override,
    difficulty: override.difficulty ?? DIFFICULTY_OVERRIDES[item.id] ?? base.difficulty,
    audiences: dedupe([...(override.audiences ?? []), ...base.audiences]) as LibraryAudience[],
    bestFor: override.bestFor ?? base.bestFor,
    notFor: override.notFor ?? base.notFor,
    useCases: override.useCases ?? base.useCases,
    alternatives: override.alternatives ?? alternativesFor(item),
    isChineseFriendly: override.isChineseFriendly ?? base.isChineseFriendly,
    isGoodForGlobal: override.isGoodForGlobal ?? base.isGoodForGlobal,
    isGoodForCreators: override.isGoodForCreators ?? base.isGoodForCreators,
    isGoodForBuilders: override.isGoodForBuilders ?? base.isGoodForBuilders,
  };
}

export function getLibraryItemsWithGuide(items: LibraryItem[] = LIBRARY_ITEMS): LibraryItemWithGuide[] {
  return items.map((item) => ({ ...item, guide: getLibraryGuide(item) }));
}

export function getLibraryItemWithGuide(id: string): LibraryItemWithGuide | null {
  const item = LIBRARY_ITEMS.find((entry) => entry.id === id);
  return item ? { ...item, guide: getLibraryGuide(item) } : null;
}
