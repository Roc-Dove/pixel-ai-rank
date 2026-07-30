import { SIGNAL_ITEMS, SIGNALS_LAST_VERIFIED } from "@/lib/signals/items";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { getSignalLifecycle } from "@/lib/signals/utils";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRfc822(date: string) {
  return new Date(`${date}T00:00:00+08:00`).toUTCString();
}

export function GET() {
  const items = SIGNAL_ITEMS.map((item) => {
    const url = absoluteUrl(`/signals/${item.id}`);
    const lifecycle = getSignalLifecycle(item);
    const description = [
      item.summary,
      `状态：${lifecycle.label}`,
      `为什么重要：${item.whyItMatters}`,
      `建议下一步：${item.nextStep}`,
    ].join("\n\n");

    return [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${toRfc822(item.date)}</pubDate>`,
      `      <category>${escapeXml(item.category)}</category>`,
      `      <description>${escapeXml(description)}</description>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${SITE_NAME}｜最新 AI 情报</title>`,
    `    <link>${absoluteUrl("/signals")}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>zh-CN</language>",
    `    <lastBuildDate>${toRfc822(SIGNALS_LAST_VERIFIED)}</lastBuildDate>`,
    `    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
