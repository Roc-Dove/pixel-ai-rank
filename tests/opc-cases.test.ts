import assert from "node:assert/strict";
import test from "node:test";
import { FEATURED_OPC_CASES, OPC_CASES, OPC_LAST_VERIFIED } from "../lib/opc/items";

test("OPC cases keep team status and dated evidence explicit", () => {
  assert.ok(OPC_CASES.length >= 6);
  assert.equal(OPC_LAST_VERIFIED, "2026-08-01");
  assert.equal(new Set(OPC_CASES.map((item) => item.id)).size, OPC_CASES.length);

  for (const item of OPC_CASES) {
    assert.match(item.productUrl, /^https:\/\//);
    assert.match(item.resultEvidence.url, /^https:\/\//);
    assert.match(item.teamEvidence.url, /^https:\/\//);
    assert.ok(item.resultAsOf <= OPC_LAST_VERIFIED);
    assert.ok(item.resultEvidence.date <= OPC_LAST_VERIFIED);
    assert.ok(item.teamEvidence.date <= OPC_LAST_VERIFIED);
    assert.ok(item.teamSummary.length >= 6);
    assert.ok(item.takeaway.length >= 18);
    assert.ok(item.channels.length >= 2);
  }
});

test("homepage OPC samples are current one-person operations only", () => {
  assert.equal(FEATURED_OPC_CASES.length, 4);
  assert.ok(FEATURED_OPC_CASES.every((item) => item.status === "current"));
  assert.ok(!FEATURED_OPC_CASES.some((item) => item.id === "sitegpt"));
  assert.ok(!FEATURED_OPC_CASES.some((item) => item.id === "base44"));
});

test("OPC collection separates current, micro-team and historical cases", () => {
  const statuses = new Set(OPC_CASES.map((item) => item.status));
  assert.deepEqual(statuses, new Set(["current", "micro-team", "historical"]));
});
