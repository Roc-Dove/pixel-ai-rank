import test from "node:test";
import assert from "node:assert/strict";
import {
  getSuccessfulBatchStatus,
  isRankDataStale,
  RANK_DATA_STALE_AFTER_MS,
} from "@/lib/rank-freshness";
import { RANK_TYPES, TAB_CONFIG } from "@/types/rank";

const NOW = Date.parse("2026-07-28T12:00:00.000Z");

test("真实抓取榜单使用各自的外部来源名称", () => {
  const labels = RANK_TYPES.map((type) => TAB_CONFIG[type].databaseSourceLabel);

  assert.deepEqual(labels, [
    "AICPB 中国 AI 产品增长榜",
    "AI工具集（AIXZD）趋势新品榜",
    "AI工具集（AIXZD）综合月榜",
    "Xhunt AI KOL 榜 · 中文",
    "Xhunt AI KOL 榜 · 全球",
  ]);
  assert.ok(labels.every((label) => label !== "Pixel AI Rank 精选"));
});

test("成功批次超过 72 小时后标记为 stale", () => {
  const exactBoundary = new Date(NOW - RANK_DATA_STALE_AFTER_MS);
  const overBoundary = new Date(NOW - RANK_DATA_STALE_AFTER_MS - 1);

  assert.equal(isRankDataStale(exactBoundary, NOW), false);
  assert.equal(isRankDataStale(overBoundary, NOW), true);
  assert.equal(getSuccessfulBatchStatus(overBoundary, null, NOW), "stale");
});

test("新鲜成功批次可用，但后续失败会标记为 degraded", () => {
  const successfulAt = new Date(NOW - 60 * 60 * 1000);

  assert.equal(getSuccessfulBatchStatus(successfulAt, null, NOW), "ready");
  assert.equal(
    getSuccessfulBatchStatus(
      successfulAt,
      { status: "failed", scrapedAt: new Date(NOW - 30 * 60 * 1000) },
      NOW,
    ),
    "degraded",
  );
});

test("过期状态优先于后续抓取失败状态", () => {
  const successfulAt = new Date(NOW - RANK_DATA_STALE_AFTER_MS - 1);

  assert.equal(
    getSuccessfulBatchStatus(
      successfulAt,
      { status: "failed", scrapedAt: new Date(NOW - 60 * 60 * 1000) },
      NOW,
    ),
    "stale",
  );
});
