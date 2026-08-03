import assert from "node:assert/strict";
import test from "node:test";
import {
  GLOBAL_PRODUCTS_LAST_VERIFIED,
  INDIE_AI_PRODUCTS,
  INTERNATIONAL_PRODUCT_COUNT,
  MAINSTREAM_AI_PRODUCTS,
} from "../lib/global-products";

test("international products are split into mainstream and indie lanes", () => {
  assert.equal(MAINSTREAM_AI_PRODUCTS.length, 6);
  assert.equal(INDIE_AI_PRODUCTS.length, 6);
  assert.equal(INTERNATIONAL_PRODUCT_COUNT, 12);
  assert.equal(GLOBAL_PRODUCTS_LAST_VERIFIED, "2026-08-03");

  const ids = [...MAINSTREAM_AI_PRODUCTS, ...INDIE_AI_PRODUCTS].map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every international product keeps an official product and evidence link", () => {
  for (const item of [...MAINSTREAM_AI_PRODUCTS, ...INDIE_AI_PRODUCTS]) {
    assert.match(item.productUrl, /^https:\/\//);
    assert.match(item.sourceUrl, /^https:\/\//);
    assert.ok(item.tagline.length >= 18);
    assert.match(item.accent, /^#[0-9a-f]{6}$/i);
  }
});

test("indie lane keeps team and internationalization signals explicit", () => {
  for (const item of INDIE_AI_PRODUCTS) {
    assert.ok(item.teamLabel.length >= 4);
    assert.ok(item.globalSignal.length >= 8);
    assert.ok(item.businessModel.length >= 4);
  }
});
