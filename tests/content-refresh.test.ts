import assert from "node:assert/strict";
import test from "node:test";
import { LIBRARY_ITEMS } from "../lib/library/items";
import { getLibraryItemsWithGuide } from "../lib/library/guide";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "../lib/signals/items";
import { getSignalLifecycle } from "../lib/signals/utils";

test("official signal feed is unique, sorted and fully sourced", () => {
  assert.ok(SIGNAL_ITEMS.length >= 22);
  assert.equal(SIGNALS_LAST_VERIFIED, "2026-07-30");
  assert.equal(SIGNAL_ITEMS[0].date, "2026-07-29");
  assert.ok(SIGNAL_ITEMS.some((item) => item.id === "chatgpt-academic-researchers"));
  assert.ok(SIGNAL_ITEMS.some((item) => item.id === "gpt-5-6-efficiency-engineering"));
  assert.equal(new Set(SIGNAL_ITEMS.map((item) => item.id)).size, SIGNAL_ITEMS.length);

  for (let index = 0; index < SIGNAL_ITEMS.length; index += 1) {
    const item = SIGNAL_ITEMS[index];
    assert.match(item.sourceUrl, /^https:\/\//);
    assert.ok(item.facts.length >= 3);
    assert.ok(item.nextStep.length >= 12);
    assert.ok(item.date <= SIGNALS_LAST_VERIFIED);
    if (index > 0) assert.ok(SIGNAL_ITEMS[index - 1].date >= item.date);
  }
});

test("action signals expose a lifecycle separate from editorial impact", () => {
  const academicProgram = SIGNAL_ITEMS.find((item) => item.id === "chatgpt-academic-researchers");
  const githubRetirement = SIGNAL_ITEMS.find((item) => item.id === "github-models-retirement");
  const deepseekAliases = SIGNAL_ITEMS.find((item) => item.id === "deepseek-legacy-aliases-retired");

  assert.ok(academicProgram);
  assert.ok(githubRetirement);
  assert.ok(deepseekAliases);
  assert.deepEqual(getSignalLifecycle(academicProgram, SIGNALS_LAST_VERIFIED), { status: "open", label: "申请已开放" });
  assert.deepEqual(getSignalLifecycle(githubRetirement, SIGNALS_LAST_VERIFIED), { status: "due-today", label: "今日截止" });
  assert.equal(getSignalLifecycle(deepseekAliases, SIGNALS_LAST_VERIFIED).status, "retired");
});

test("refreshed library removes retired products and keeps ids unique", () => {
  const ids = LIBRARY_ITEMS.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!ids.includes("tome"));

  for (const requiredId of [
    "openai-codex",
    "claude-code",
    "qwen-code",
    "opencode",
    "grok-build",
    "kimi-work",
    "meta-ai",
    "perplexity-computer",
    "nano-banana-2",
  ]) {
    assert.ok(ids.includes(requiredId), `missing refreshed tool ${requiredId}`);
  }
});

test("signal relations only point to existing library tools", () => {
  const ids = new Set(LIBRARY_ITEMS.map((item) => item.id));
  for (const signal of SIGNAL_ITEMS) {
    for (const relatedToolId of signal.relatedToolIds) {
      assert.ok(ids.has(relatedToolId), `${signal.id} points to missing tool ${relatedToolId}`);
    }
  }
});

test("library guides disclose source tier and evaluation depth", () => {
  const items = getLibraryItemsWithGuide();
  const official = items.filter((item) => item.sourceTier === "official");
  const community = items.filter((item) => item.sourceTier === "community");
  const individual = items.filter((item) => item.guideDepth === "individual");
  const category = items.filter((item) => item.guideDepth === "category");

  assert.ok(official.length > 0);
  assert.ok(community.length > 0);
  assert.equal(official.length + community.length, items.length);
  assert.ok(individual.length > 0);
  assert.ok(category.length > 0);
  assert.equal(individual.length + category.length, items.length);
});
