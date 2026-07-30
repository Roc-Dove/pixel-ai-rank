import assert from "node:assert/strict";
import test from "node:test";
import { GET as getFeed } from "../app/feed.xml/route";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { LIBRARY_ITEMS } from "../lib/library/items";
import { SIGNAL_ITEMS } from "../lib/signals/items";
import { SITE_URL } from "../lib/site";
import { RANK_TYPES } from "../types/rank";

test("sitemap exposes every static content route exactly once", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  const expectedCount = 3 + RANK_TYPES.length + SIGNAL_ITEMS.length + LIBRARY_ITEMS.length;

  assert.equal(entries.length, expectedCount);
  assert.equal(new Set(urls).size, entries.length);
  assert.ok(urls.includes(`${SITE_URL}/signals/${SIGNAL_ITEMS[0].id}`));
  assert.ok(urls.includes(`${SITE_URL}/library/${LIBRARY_ITEMS[0].id}`));
});

test("robots points crawlers to the canonical sitemap and hides APIs", () => {
  const value = robots();

  assert.equal(value.sitemap, `${SITE_URL}/sitemap.xml`);
  assert.deepEqual(value.rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/"],
  });
});

test("RSS feed publishes the verified signal collection", async () => {
  const response = getFeed();
  const xml = await response.text();

  assert.match(response.headers.get("content-type") ?? "", /^application\/rss\+xml/);
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, new RegExp(`<guid isPermaLink="true">${SITE_URL}/signals/`));
  assert.equal((xml.match(/<item>/g) ?? []).length, SIGNAL_ITEMS.length);
});
