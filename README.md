# Pixel AI Rank

一个面向中文用户的 AI 情报导航站：把官方最新发布、产品榜、KOL 信号和 AI 工具导购整理成清晰、可核验、可行动的发现系统。

## 当前完成度

- `/`：AI 决策总览，优先呈现最新官方情报、紧急变更和近期核验工具
- `/signals`：22 条截至 2026-07-30 核验的官方 AI 情报，支持主题、优先级和关键词筛选
- `/signals/[id]`：22 个静态情报详情页，拆分官方事实、生命周期、影响判断、行动建议与相关工具
- `/feed.xml`：可长期订阅的官方情报 RSS
- `/rank/[type]`：5 个榜单，支持搜索、排序、响应式分页和数据来源说明
- `/library`：112 个精选工具、13 个分类，支持人群/分类/关键词筛选和增量加载
- `/library/[id]`：112 个静态详情页，包含适合人群、上手难度、使用场景、替代工具、来源与近期动态
- 深浅主题、键盘焦点、跳转主内容、移动端 44px 触控目标和 `prefers-reduced-motion`
- Prisma 榜单批次存储、5 个抓取器、72 小时过期状态、Vercel Cron、失败降级与数据库短时熔断

视觉方向为 `AI Intelligence Desk × Restrained Pixel`：像素元素只用于品牌标和排名数字，主体采用现代数据产品语言。

## 榜单与数据模式

| 路由 | 内容 |
| --- | --- |
| `/rank/aicpb` | 出海精选 |
| `/rank/stars` | 趋势新品 |
| `/rank/month` | 综合月榜 |
| `/rank/xhunt_cn` | 中文 AI KOL |
| `/rank/xhunt_global` | 全球 AI KOL |

页面与 API 会明确标注数据模式：

- `database`：最近一次成功的真实抓取结果
- `curated`：真实数据库没有可用条目时，基于本站 AI 工具库字段计算的精选榜
- `demo`：KOL 数据不足或数据源不可用时的内置可浏览版本

真实批次超过 72 小时会显示 `stale / 数据已过期`，不再把历史快照称为实时可用；AICPB、AIXZD 与 Xhunt 数据也会分别显示各自真实来源。

真实数据库结果不会再被静态精选榜覆盖。数据库不可达时会先进行快速连通性检查，并短时熔断，避免每个请求重复等待慢连接。

## 技术栈

- Next.js 16 App Router + React 19 + TypeScript 5
- Tailwind CSS 4 + 自定义语义化设计 token
- Prisma 6 + PostgreSQL
- Cheerio / Axios 静态抓取
- Puppeteer Core 24.43.1 + Chromium 148 动态抓取
- Zod 环境变量校验

## 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

如果只想浏览前端，可以把 `DATABASE_URL`、`DIRECT_URL` 留空；站点会直接进入精选/演示模式。

## 环境变量

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"
CRON_SECRET="replace-with-a-long-random-secret"
PUPPETEER_EXECUTABLE_PATH=""
```

- `DATABASE_URL`：页面读取和抓取写入使用的数据库连接
- `DIRECT_URL`：Prisma migration 使用的直连地址，可选
- `CRON_SECRET`：抓取接口必填密钥；未配置时接口返回 `503`，不再使用公开默认值
- `PUPPETEER_EXECUTABLE_PATH`：本地执行 Xhunt 动态抓取时的 Chrome/Chromium 路径

空字符串会被视为未配置。

## 数据库初始化

仓库已经包含初始 migration：

```bash
npm run db:migrate
```

它会创建 `ScrapeBatch`、`RankItem`、`RankType` 及查询索引。首次部署前应先在目标数据库执行 migration。

## API

读取榜单：

```bash
GET /api/rank/aicpb
GET /api/rank/stars
GET /api/rank/month
GET /api/rank/xhunt_cn
GET /api/rank/xhunt_global
```

触发抓取：

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/scrape
```

Vercel Cron 默认每两天执行一次。静态页面抓取并行，两个 Puppeteer KOL 抓取串行，以降低 serverless 内存峰值。单个来源失败会记录失败批次，不会阻塞其他榜单。

## 常用命令

```bash
npm run dev          # 本地开发
npm run lint         # ESLint
npm run test         # Node 测试
npm run typecheck    # TypeScript
npm run check        # lint + test + typecheck
npm run build        # Prisma Client + Next 生产构建
npm run db:migrate   # 部署数据库 migration
```

## 目录结构

```text
app/                 页面、元数据与 Route Handlers
components/          布局、情报、榜单、工具库和基础 UI
lib/signals/         官方 AI 情报、核验日期与行动建议
lib/library/         112 个工具、中文导购字段与精选榜算法
lib/scrapers/        5 个数据抓取器与批次读写
lib/db/              Prisma Client
prisma/migrations/   可重建数据库的 migration
tests/               工具函数与后端加固回归测试
types/               榜单与工具库领域类型
```

## 上线前检查

1. 配置 PostgreSQL、`CRON_SECRET` 和 Vercel Cron。
2. 执行 `npm run db:migrate`。
3. 在 Linux/serverless 环境实跑一次 Xhunt，确认外部页面 DOM 未变化。
4. 执行 `npm run check && npm run build`。
5. 观察首次 cron 的条目数、失败批次和降级状态。
