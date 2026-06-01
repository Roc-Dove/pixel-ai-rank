"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { classifyMetricTone, formatMetricDisplay } from "@/lib/utils/metric";
import { type RankItemDto, type RankPayload } from "@/types/rank";
import { PixelButton, pixelButtonClassName } from "@/components/ui/PixelButton";

const PAGE_SIZE = 20;

const METRIC_LABELS: Record<RankPayload["type"], { primary: string; secondary: string }> = {
  aicpb: { primary: "出海适配", secondary: "推荐指数" },
  stars: { primary: "趋势潜力", secondary: "推荐指数" },
  month: { primary: "综合推荐", secondary: "推荐指数" },
  xhunt_cn: { primary: "影响力", secondary: "活跃度" },
  xhunt_global: { primary: "影响力", secondary: "活跃度" },
};

type SortMode = "rank" | "primary" | "secondary";

const IMAGE_OVERRIDES: Record<string, string> = {
  "Z.ai | 智谱": "https://www.google.com/s2/favicons?domain=z.ai&sz=128",
  Codex: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
  "ChatGPT Images 2.0": "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
  "Google Gemini": "https://cdn.simpleicons.org/googlegemini/1b1b3a",
  Claude: "https://cdn.simpleicons.org/anthropic/1b1b3a",
  DeepSeek: "https://cdn.simpleicons.org/deepseek/1b1b3a",
  Grok: "https://cdn.simpleicons.org/x/1b1b3a",
  "Perplexity AI": "https://cdn.simpleicons.org/perplexity/1b1b3a",
  Grammarly: "https://cdn.simpleicons.org/grammarly/1b1b3a",
  "Hugging Face": "https://cdn.simpleicons.org/huggingface/1b1b3a",
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

    if (handle) {
      return `https://unavatar.io/x/${handle}`;
    }

    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="pixel-rank-badge gold">🥇</span>;
  if (rank === 2) return <span className="pixel-rank-badge silver">🥈</span>;
  if (rank === 3) return <span className="pixel-rank-badge bronze">🥉</span>;
  return <span className="pixel-rank-badge">{rank}</span>;
}

function MetricBadge({ label, value, primary = false }: { label: string; value: string | null; primary?: boolean }) {
  const tone = primary ? "primary" : classifyMetricTone(value);
  const display = formatMetricDisplay(value);
  const shouldShowTrendArrow = !primary && /增长|涨幅|活跃|率/.test(label);
  const content =
    display === "N/A"
      ? display
      : primary
        ? display
        : shouldShowTrendArrow && tone === "positive"
          ? `▲ ${display}`
          : shouldShowTrendArrow && tone === "negative"
            ? `▼ ${display}`
            : display;

  return (
    <div className={["pixel-metric", tone].filter(Boolean).join(" ")}>
      <span>{label}</span>
      <strong>{content}</strong>
    </div>
  );
}

function RankImage({ item }: { item: RankItemDto }) {
  const [failed, setFailed] = useState(false);
  const fallbackLabel = item.name.trim().charAt(0).toUpperCase() || "?";
  const imageUrl = failed ? null : getImageUrl(item);

  if (!imageUrl) {
    return <div className="pixel-logo-fallback">{fallbackLabel}</div>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={`${item.name} logo`}
      className="pixel-logo"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function RankRow({ item, metricLabels }: { item: RankItemDto; metricLabels: { primary: string; secondary: string } }) {
  return (
    <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="pixel-row">
      <div className="flex items-center gap-3">
        <RankBadge rank={item.rank} />
        <span className="pixel-font text-xs">#{item.rank}</span>
      </div>

      <div className="flex min-w-0 items-start gap-3">
        <RankImage item={item} />

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="pixel-font truncate text-xs text-[var(--px-text)]">{item.name}</p>
            {item.metricTertiary ? <span className="pixel-chip blue">{item.metricTertiary}</span> : null}
          </div>
          <p className="truncate text-sm text-[var(--px-text-muted)]">{item.description || "暂无简介"}</p>
        </div>
      </div>

      <MetricBadge label={metricLabels.primary} value={item.metricPrimary} primary />
      <MetricBadge label={metricLabels.secondary} value={item.metricSecondary} />

      <div className="flex justify-start lg:justify-end">
        <span className={pixelButtonClassName({ tone: "blue" })}>前往 ↗</span>
      </div>
    </a>
  );
}

function SortButton({
  active,
  children,
  mode,
  onSelect,
}: {
  active: boolean;
  children: ReactNode;
  mode: SortMode;
  onSelect: (mode: SortMode) => void;
}) {
  return (
    <PixelButton tone="ghost" active={active} onClick={() => onSelect(mode)}>
      {children}
    </PixelButton>
  );
}

export function RankTable({
  payload,
  items,
  searchQuery,
  onRetry,
}: {
  payload: RankPayload;
  items: RankItemDto[];
  searchQuery: string;
  onRetry: () => void;
}) {
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState<SortMode>("rank");

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const metricLabels = METRIC_LABELS[payload.type];
  const shouldShowPagination = totalPages > 1;

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setPage(1);
  };

  const sortedItems = useMemo(() => {
    const list = [...items];

    if (sortMode === "primary") {
      return list.sort((left, right) => parseMetricValue(right.metricPrimary) - parseMetricValue(left.metricPrimary) || left.rank - right.rank);
    }

    if (sortMode === "secondary") {
      return list.sort((left, right) => parseMetricValue(right.metricSecondary) - parseMetricValue(left.metricSecondary) || left.rank - right.rank);
    }

    return list.sort((left, right) => left.rank - right.rank);
  }, [items, sortMode]);

  const currentItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [safePage, sortedItems]);

  if (items.length === 0) {
    return (
      <div className="pixel-empty">
        <div className="space-y-2">
          <p className="pixel-font text-sm">GAME OVER</p>
          <p>未找到可展示的数据{searchQuery ? "，请尝试缩短搜索关键词。" : "，请稍后重试或先触发一次抓取。"} </p>
          {payload.message ? <p className="text-sm text-[var(--px-text-muted)]">{payload.message}</p> : null}
        </div>
        <PixelButton tone="red" onClick={onRetry}>
          重试
        </PixelButton>
      </div>
    );
  }

  return (
    <section className="nes-container is-rounded pixel-panel space-y-5">
      <div className="pixel-table-toolbar">
        <div>
          <p className="title">{`${payload.label} / ${items.length} 条`}</p>
          <p className="text-sm text-[var(--px-text-muted)]">
            {shouldShowPagination ? `第 ${safePage} / ${totalPages} 页` : `共 ${items.length} 条`}
            {searchQuery ? `，${items.length} 条匹配结果` : ""}
          </p>
        </div>

        <div className="pixel-sort-controls" aria-label="排序方式">
          <SortButton active={sortMode === "rank"} mode="rank" onSelect={handleSortChange}>
            排名
          </SortButton>
          <SortButton active={sortMode === "primary"} mode="primary" onSelect={handleSortChange}>
            {metricLabels.primary}
          </SortButton>
          <SortButton active={sortMode === "secondary"} mode="secondary" onSelect={handleSortChange}>
            {metricLabels.secondary}
          </SortButton>
        </div>
      </div>

      <div className="space-y-3">
        <div className="pixel-grid-header pixel-muted">
          <span>#</span>
          <span>产品 / KOL</span>
          <span>{metricLabels.primary}</span>
          <span>{metricLabels.secondary}</span>
          <span>操作</span>
        </div>
        {currentItems.map((item) => (
          <RankRow key={`${payload.type}-${item.rank}-${item.name}`} item={item} metricLabels={metricLabels} />
        ))}
      </div>

      {shouldShowPagination ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PixelButton tone="ghost" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1}>
            ◀ 上一页
          </PixelButton>
          <span className="pixel-chip blue">第 {safePage} 页</span>
          <PixelButton tone="ghost" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages}>
            下一页 ▶
          </PixelButton>
        </div>
      ) : null}
    </section>
  );
}
