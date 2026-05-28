import test from "node:test";
import assert from "node:assert/strict";
import { formatCompactNumber } from "@/lib/utils/formatNumber";
import { getMonthSlug } from "@/lib/utils/getMonthSlug";
import { classifyMetricTone } from "@/lib/utils/metric";

test("getMonthSlug 返回上一个月", () => {
  assert.equal(getMonthSlug(new Date("2026-05-26T12:00:00Z")), "202604");
  assert.equal(getMonthSlug(new Date("2026-01-02T12:00:00Z")), "202512");
});

test("formatCompactNumber 按数量级格式化", () => {
  assert.equal(formatCompactNumber(999), "999");
  assert.equal(formatCompactNumber(1200), "1.2K");
  assert.equal(formatCompactNumber(8_540_000), "8.54M");
});

test("classifyMetricTone 识别指标正负性", () => {
  assert.equal(classifyMetricTone("+24.58%"), "positive");
  assert.equal(classifyMetricTone("-5.6%"), "negative");
  assert.equal(classifyMetricTone("—"), "neutral");
});
