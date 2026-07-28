import assert from "node:assert/strict";
import test from "node:test";
import { LIBRARY_ITEMS } from "../lib/library/items";
import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "../lib/signals/items";

test("official signal feed is unique, sorted and fully sourced", () => {
  assert.ok(SIGNAL_ITEMS.length >= 18);
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
