import assert from "node:assert/strict";
import test from "node:test";
import {
  GLOBAL_PRODUCTS_LAST_VERIFIED,
  INDIE_AI_PRODUCTS,
  INTERNATIONAL_PRODUCT_COUNT,
  MAINSTREAM_AI_PRODUCTS,
} from "../lib/global-products";

test("international products are split into mainstream and indie lanes", () => {
  assert.ok(MAINSTREAM_AI_PRODUCTS.length >= 24);
  assert.ok(INDIE_AI_PRODUCTS.length >= 24);
  assert.equal(INTERNATIONAL_PRODUCT_COUNT, MAINSTREAM_AI_PRODUCTS.length + INDIE_AI_PRODUCTS.length);
  assert.equal(GLOBAL_PRODUCTS_LAST_VERIFIED, "2026-08-04");

  const ids = [...MAINSTREAM_AI_PRODUCTS, ...INDIE_AI_PRODUCTS].map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);

  const productUrls = [...MAINSTREAM_AI_PRODUCTS, ...INDIE_AI_PRODUCTS].map((item) => item.productUrl);
  assert.equal(new Set(productUrls).size, productUrls.length);
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
