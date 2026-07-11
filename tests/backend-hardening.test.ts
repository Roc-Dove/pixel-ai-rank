import test from "node:test";
import assert from "node:assert/strict";
import { getServerEnv } from "@/lib/env";
import { buildSelectedLibraryRankPayload } from "@/lib/library/rank-sync";
import { type RankPayload } from "@/types/rank";

function buildPayload(overrides: Partial<RankPayload> = {}): RankPayload {
  return {
    type: "aicpb",
    dbType: "AICPB",
    label: "测试榜单",
    sourceLabel: "真实数据库",
    sourceStatus: "ready",
    dataMode: "database",
    totalItems: 1,
    lastUpdated: "2026-07-10T00:00:00.000Z",
    items: [
      {
        rank: 1,
        name: "Database Result",
        description: null,
        logoUrl: null,
        externalLink: "https://example.com",
        detailLink: null,
        metricPrimary: "100",
        metricSecondary: null,
        metricTertiary: null,
      },
    ],
    ...overrides,
  };
}

test("精选榜不会覆盖可用的真实数据库结果", () => {
  const payload = buildPayload();

  assert.equal(buildSelectedLibraryRankPayload(payload), payload);
});

test("没有可用真实条目时才生成 curated 精选榜", () => {
  const payload = buildPayload({ totalItems: 0, items: [] });
  const result = buildSelectedLibraryRankPayload(payload);

  assert.equal(result.dataMode, "curated");
  assert.equal(result.lastUpdated, null);
  assert.ok(result.items.length > 0);
});

test("空字符串服务端环境变量会被当作未配置", () => {
  const keys = ["DATABASE_URL", "DIRECT_URL", "CRON_SECRET", "PUPPETEER_EXECUTABLE_PATH"] as const;
  const previousValues = new Map(keys.map((key) => [key, process.env[key]]));

  try {
    keys.forEach((key) => {
      process.env[key] = "   ";
    });

    assert.deepEqual(getServerEnv(), {
      DATABASE_URL: undefined,
      DIRECT_URL: undefined,
      CRON_SECRET: undefined,
      PUPPETEER_EXECUTABLE_PATH: undefined,
    });
  } finally {
    keys.forEach((key) => {
      const previousValue = previousValues.get(key);
      if (previousValue === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previousValue;
      }
    });
  }
});
