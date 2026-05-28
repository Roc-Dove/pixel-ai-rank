# Pixel AI Rank

像素风 AI 榜单聚合站，聚合 AI 产品榜单与 AI KOL 榜单，并支持数据库抓取与无数据库演示降级。

## 功能概览

- 默认访问 `/` 自动跳转到 `/rank/aicpb`
- 支持 5 个榜单切换：`aicpb`、`stars`、`month`、`xhunt_cn`、`xhunt_global`
- 支持当前榜单内搜索、分页、主题切换
- 提供统一读取接口：`/api/rank/[type]`
- 提供抓取触发接口：`/api/cron/scrape`
- 未配置数据库时自动降级到内置演示数据，页面仍可正常浏览

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4 + `nes.css`
- Prisma 6
- `axios` + `cheerio`
- `puppeteer-core` + `@sparticuz/chromium`

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 如需真实数据库抓取，复制环境变量模板：

```bash
cp .env.example .env.local
```

3. 启动开发环境：

```bash
npm run dev
```

4. 打开 [http://localhost:3000](http://localhost:3000)

## 环境变量

`.env.example` 中包含这些变量：

```bash
DATABASE_URL="postgresql://user:password@host:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
CRON_SECRET="replace-with-a-random-secret"
PUPPETEER_EXECUTABLE_PATH=""
```

- `DATABASE_URL`：读取榜单和写入抓取结果所需；未配置时页面自动降级到演示数据
- `DIRECT_URL`：Prisma 直连数据库时可选
- `CRON_SECRET`：调用 `/api/cron/scrape` 时的 Bearer Token
- `PUPPETEER_EXECUTABLE_PATH`：本地如需指定浏览器路径时可用，通常可留空

## 数据模式

### 演示模式

未配置 `DATABASE_URL` 时：

- 页面直接展示内置 mock 数据
- `/api/rank/[type]` 仍可返回可消费的榜单结构
- `/api/cron/scrape` 会返回 `503` 并提示先配置数据库

### 真实数据模式

配置好数据库后：

- 页面优先读取数据库中该榜单最近一次成功抓取结果
- `/api/cron/scrape` 可触发全量抓取
- 若单个来源抓取失败，仅该来源降级，不阻塞其它榜单

## 常用脚本

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run check
```

当前状态：

- `npm run test` 已通过
- `npm run build` 已通过

## 接口说明

### 读取榜单

```bash
GET /api/rank/aicpb
GET /api/rank/stars
GET /api/rank/month
GET /api/rank/xhunt_cn
GET /api/rank/xhunt_global
```

返回值会包含：

- 榜单类型
- 数据模式（`database` 或 `demo`）
- 源状态（`ready` / `degraded` / `empty`）
- 更新时间
- 条目列表
- 降级提示信息

### 触发抓取

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/scrape
```

说明：

- 未配置 `DATABASE_URL` 时会返回 `503`
- 需要在请求头里带上 `Authorization: Bearer <CRON_SECRET>`
- 返回结果会列出每个榜单的抓取状态与条目数

## 开发建议

- 优先先跑 `npm run build`，确认生产构建无误
- 若需要联调真实数据，先准备可用的 PostgreSQL / Supabase 连接串
- `xhunt` 依赖动态抓取，上线前应重新验证页面结构与选择器

## 项目结构

```text
app/
  api/
  rank/
components/
  layout/
  providers/
  rank/
  ui/
lib/
  db/
  mock/
  scrapers/
  utils/
prisma/
tests/
types/
```
