"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownUp, ArrowUpRight, ChevronLeft, ChevronRight, Info, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";
import { classifyMetricTone, formatMetricDisplay } from "@/lib/utils/metric";
import { type RankItemDto, type RankPayload } from "@/types/rank";

const PAGE_SIZE = 12;

const PRODUCT_METRIC_LABELS: Record<"aicpb" | "stars" | "month", { primary: string; secondary: string }> = {
  aicpb: { primary: "出海适配", secondary: "编辑评分" },
  stars: { primary: "趋势潜力", secondary: "编辑评分" },
  month: { primary: "综合评分", secondary: "编辑评分" },
};

type SortMode = "rank" | "primary" | "secondary";

const IMAGE_OVERRIDES: Record<string, string> = {
  "Z.ai | 智谱": "https://www.google.com/s2/favicons?domain=z.ai&sz=128",
  Codex: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
  "ChatGPT Images 2.0": "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
  "Google Gemini": "https://cdn.simpleicons.org/googlegemini/111827",
  Claude: "https://cdn.simpleicons.org/anthropic/111827",
  DeepSeek: "https://cdn.simpleicons.org/deepseek/111827",
  Grok: "https://cdn.simpleicons.org/x/111827",
  "Perplexity AI": "https://cdn.simpleicons.org/perplexity/111827",
  Grammarly: "https://cdn.simpleicons.org/grammarly/111827",
  "Hugging Face": "https://cdn.simpleicons.org/huggingface/111827",
  宝玉: "https://unavatar.io/x/dotey",
  归藏: "https://unavatar.io/x/op7418",
  "AI 工具箱": "https://unavatar.io/x/op7418",
  亦仁: "https://unavatar.io/x/yiren",
  DK: "https://unavatar.io/x/dk",
  "Andrej Karpathy": "https://unavatar.io/x/karpathy",
  "Allie K. Miller": "https://unavatar.io/x/alliekmiller",
  Santiago: "https://unavatar.io/x/svpino",
  "Logan Kilpatrick": "https://unavatar.io/x/OfficialLoganK",
  "Matt Shumer": "https://unavatar.io/x/mattshumer_",
};

const FALLBACK_LOGO_NAMES = new Set(["Gamma", "Cursor", "HeyGen", "Midjourney", "Leonardo AI", "Kimi"]);

function metricConfig(payload: RankPayload) {
  if (payload.type === "xhunt_cn" || payload.type === "xhunt_global") {
    if (payload.dataMode === "database") {
      return { primary: "关注者", secondary: "账号", secondarySortable: false };
    }
    return { primary: "影响力", secondary: "活跃度", secondarySortable: true };
  }

  return { ...PRODUCT_METRIC_LABELS[payload.type], secondarySortable: true };
}

function parseMetricValue(value: string | null) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const normalized = value.trim().replace(/,/g, "");
  if (!normalized || normalized === "—" || normalized === "-") return Number.NEGATIVE_INFINITY;

  const numeric = Number.parseFloat(normalized.replace(/[%+]/g, ""));
  if (Number.isNaN(numeric)) return Number.NEGATIVE_INFINITY;

  const suffix = normalized.match(/[KMB]$/i)?.[0]?.toUpperCase();
  const multiplier = suffix === "K" ? 1_000 : suffix === "M" ? 1_000_000 : suffix === "B" ? 1_000_000_000 : 1;
  return numeric * multiplier;
}

function getImageUrl(item: RankItemDto) {
  if (item.logoUrl) return item.logoUrl;
  if (IMAGE_OVERRIDES[item.name]) return IMAGE_OVERRIDES[item.name];
  if (FALLBACK_LOGO_NAMES.has(item.name)) return null;

  try {
    const url = new URL(item.externalLink);
    const handle = url.hostname === "x.com" || url.hostname === "twitter.com" ? url.pathname.split("/").filter(Boolean)[0] : null;
    if (handle) return `https://unavatar.io/x/${handle}`;
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div className={`pixel-rank-badge ${rank <= 3 ? `is-top is-top-${rank}` : ""}`} aria-label={`第 ${rank} 名`}>
      <span>{String(rank).padStart(2, "0")}</span>
      {rank <= 3 ? <small>TOP</small> : null}
    </div>
  );
}

function MetricBadge({ label, value, primary = false, plain = false }: { label: string; value: string | null; primary?: boolean; plain?: boolean }) {
  const tone = plain ? "neutral" : primary ? "primary" : classifyMetricTone(value);
  const display = formatMetricDisplay(value);
  const shouldShowTrend = !plain && !primary && /增长|涨幅|活跃|率/.test(label);

  return (
    <div className={`pixel-metric ${tone}`}>
      <span>{label}</span>
      <strong>
        {shouldShowTrend && tone === "positive" ? <TrendingUp size={15} aria-hidden="true" /> : null}
        {shouldShowTrend && tone === "negative" ? <TrendingDown size={15} aria-hidden="true" /> : null}
        {display}
      </strong>
    </div>
  );
}

function RankImage({ item }: { item: RankItemDto }) {
  const [failed, setFailed] = useState(false);
  const fallbackLabel = item.name.trim().charAt(0).toUpperCase() || "?";
  const imageUrl = failed ? null : getImageUrl(item);

  if (!imageUrl) return <span className="pixel-logo-fallback" aria-hidden="true">{fallbackLabel}</span>;

  return (
    <Image
      src={imageUrl}
      alt=""
      className="pixel-logo"
      width={50}
      height={50}
      sizes="50px"
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function RankRow({ item, labels }: { item: RankItemDto; labels: ReturnType<typeof metricConfig> }) {
  const internalDetail = item.detailLink?.startsWith("/") ? item.detailLink : null;
  const externalUrl = item.externalLink.startsWith("http") ? item.externalLink : null;
  const titleId = `rank-item-${item.rank}-${item.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")}`;
  const title = <span id={titleId}>{item.name}</span>;

  return (
    <article className="pixel-row" aria-labelledby={titleId}>
      <RankBadge rank={item.rank} />

      <div className="pixel-rank-product">
        <RankImage item={item} />
        <div>
          <div className="pixel-rank-product-title">
            {internalDetail ? (
              <Link href={internalDetail}>{title}</Link>
            ) : externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer">{title}</a>
            ) : title}
            {item.metricTertiary ? <span className="pixel-category-tag">{item.metricTertiary}</span> : null}
          </div>
          <p>{item.description || "暂无简介"}</p>
        </div>
      </div>

      <MetricBadge label={labels.primary} value={item.metricPrimary} primary />
      <MetricBadge label={labels.secondary} value={item.metricSecondary} plain={!labels.secondarySortable} />

      <div className="pixel-row-actions">
        {internalDetail ? <Link href={internalDetail} className={pixelButtonClassName({ tone: "ghost" })}>详情</Link> : null}
        {externalUrl ? (
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" className={pixelButtonClassName({ tone: "blue" })} aria-label={`访问 ${item.name}`}>
            <span>访问</span><ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function SortButton({ active, children, mode, onSelect }: { active: boolean; children: ReactNode; mode: SortMode; onSelect: (mode: SortMode) => void }) {
  return (
    <PixelButton tone="ghost" active={active} aria-pressed={active} onClick={() => onSelect(mode)}>
      {children}
    </PixelButton>
  );
}

export function RankTable({ payload, items, searchQuery, onRetry }: { payload: RankPayload; items: RankItemDto[]; searchQuery: string; onRetry: () => void }) {
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState<SortMode>("rank");
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const labels = metricConfig(payload);
  const shouldShowPagination = totalPages > 1;

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setPage(1);
  };

  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortMode === "primary") return list.sort((left, right) => parseMetricValue(right.metricPrimary) - parseMetricValue(left.metricPrimary) || left.rank - right.rank);
    if (sortMode === "secondary") return list.sort((left, right) => parseMetricValue(right.metricSecondary) - parseMetricValue(left.metricSecondary) || left.rank - right.rank);
    return list.sort((left, right) => left.rank - right.rank);
  }, [items, sortMode]);

  const currentItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [safePage, sortedItems]);

  if (items.length === 0) {
    return (
      <section className="pixel-empty">
        <Info size={24} aria-hidden="true" />
        <div>
          <h2>没有匹配结果</h2>
          <p>{searchQuery ? "试试缩短关键词，或搜索产品类别和简介。" : "当前没有可展示的数据，请稍后重试。"}</p>
          {payload.message ? <small>{payload.message}</small> : null}
        </div>
        <PixelButton tone="blue" onClick={onRetry}>{searchQuery ? "清空并重试" : "重新加载"}</PixelButton>
      </section>
    );
  }

  return (
    <section className="pixel-rank-table pixel-panel" aria-labelledby="rank-table-title">
      <div className="pixel-table-toolbar">
        <div>
          <span className="pixel-kicker">RANKING INDEX</span>
          <h2 id="rank-table-title">{payload.label}</h2>
          <p>{searchQuery ? `${items.length} 条匹配结果` : `共 ${items.length} 条`} · 第 {safePage} / {totalPages} 页</p>
        </div>

        <div className="pixel-sort-wrap">
          <span><ArrowDownUp size={15} aria-hidden="true" /> 排序</span>
          <div className="pixel-sort-controls" aria-label="排序方式">
            <SortButton active={sortMode === "rank"} mode="rank" onSelect={handleSortChange}>排名</SortButton>
            <SortButton active={sortMode === "primary"} mode="primary" onSelect={handleSortChange}>{labels.primary}</SortButton>
            {labels.secondarySortable ? (
              <SortButton active={sortMode === "secondary"} mode="secondary" onSelect={handleSortChange}>{labels.secondary}</SortButton>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pixel-grid-header" aria-hidden="true">
        <span>排名</span><span>产品 / KOL</span><span>{labels.primary}</span><span>{labels.secondary}</span><span>操作</span>
      </div>

      <div className="pixel-rank-rows">
        {currentItems.map((item) => <RankRow key={`${payload.type}-${item.rank}-${item.name}`} item={item} labels={labels} />)}
      </div>

      {shouldShowPagination ? (
        <nav className="pixel-pagination" aria-label="榜单分页">
          <PixelButton tone="ghost" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1}>
            <ChevronLeft size={17} aria-hidden="true" /> 上一页
          </PixelButton>
          <span><strong>{safePage}</strong> / {totalPages}</span>
          <PixelButton tone="ghost" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages}>
            下一页 <ChevronRight size={17} aria-hidden="true" />
          </PixelButton>
        </nav>
      ) : null}
    </section>
  );
}
