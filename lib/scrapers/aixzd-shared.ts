import { type RawRankItem } from "@/types/rank";
import { decodeAixzdRedirect, loadHtml, requestHtml, safeSlice, sanitizeText } from "@/lib/utils/scrape";

function parseRankFromText(text: string | null) {
  if (!text) return null;
  const match = text.match(/(^|\s)(\d{1,3})(\s|$)/);
  return match ? Number.parseInt(match[2], 10) : null;
}

function inferDescription(cardText: string | null, name: string | null) {
  if (!cardText || !name) return null;
  const compact = cardText.replace(name, " ");
  const lines = compact
    .split(/(?=[A-Z][a-z])|[\n\r]+/)
    .map((item) => sanitizeText(item))
    .filter(Boolean) as string[];
  return lines.find((item) => item.length >= 6 && !/AI产品总分|访问量|category|分类/i.test(item)) ?? null;
}

export async function scrapeAixzdCollection(url: string): Promise<RawRankItem[]> {
  try {
    const html = await requestHtml(url);
    const $ = loadHtml(html);
    const rawCards = $(".rank-list .rank-post-item, article, main section > div, main > div > div")
      .toArray()
      .filter((element: unknown) => {
        const root = $(element as never);
        const text = sanitizeText(root.text()) || "";
        return text.includes("AI产品总分") || root.find('a[href*="/category/"]').length > 0;
      });

    const seen = new Set<string>();
    const items: RawRankItem[] = [];

    rawCards.forEach((element: unknown, index: number) => {
      const card = $(element as never);
      let titleLink = card.find(".item-title-a, .post-logo, .item-excerpt a").first();
      if (titleLink.length === 0) {
        titleLink = card.find("h1 a, h2 a, h3 a, strong a").first();
      }
      if (titleLink.length === 0) {
        titleLink = card
          .find('a[href^="/"]')
          .filter((_: number, node: unknown) => !String($(node as never).attr("href") || "").includes("/category/"))
          .first();
      }
      const name = sanitizeText(titleLink.text()) || sanitizeText(card.find("h1, h2, h3, strong").first().text());
      if (!name || seen.has(name)) return;

      const text = sanitizeText(card.text());
      const rank =
        parseRankFromText(sanitizeText(card.find(".item-index .txt").first().text())) ??
        parseRankFromText(text) ??
        index + 1;
      const logoUrl = sanitizeText(card.find("img").first().attr("src")) || null;
      const detailHref = titleLink.attr("href");
      const detailLink = detailHref?.startsWith("http") ? detailHref : detailHref ? `https://aixzd.com${detailHref}` : null;
      const redirectHref =
        card.find('.item-meta a[href*="redirect="], a[href*="link.aixzd.com/?redirect="], a[href*="redirect="]').first().attr("href");
      const externalLink = decodeAixzdRedirect(redirectHref) || detailLink || "https://aixzd.com";
      const categories = card
        .find('.label-cat .txt, a[href*="/category/"] .txt, a[href*="/category/"]')
        .map((_: number, node: unknown) => sanitizeText($(node as never).text()))
        .get()
        .filter(Boolean) as string[];
      const category = categories[0] ?? null;
      const score =
        sanitizeText(card.find(".label-rank .h").first().text())?.match(/(\d{2,4})/)?.[1] ??
        sanitizeText(card.find(".meta-rank .txt").first().text())?.match(/(\d{2,4})/)?.[1] ??
        null;
      const metricCandidates = card
        .find(".meta-item .txt, .item-label .txt, span, p, div, a")
        .map((_: number, node: unknown) => sanitizeText($(node as never).text()))
        .get()
        .filter(Boolean) as string[];
      const traffic =
        sanitizeText(card.find(".meta-analytics .txt").first().text()) ??
        metricCandidates.find((value) => /\d+(\.\d+)?[KMB]/i.test(value) || /—/.test(value)) ??
        null;
      const description = sanitizeText(card.find(".excerpt-text").first().text()) ?? inferDescription(text, name);

      seen.add(name);
      items.push({
        rank,
        name,
        description,
        logoUrl,
        detailLink,
        externalLink,
        metricPrimary: score,
        metricSecondary: traffic && traffic !== score ? traffic : null,
        metricTertiary: category || categories[1] || null,
      });
    });

    return safeSlice(items, 50);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`AIXZD 抓取失败：${reason}`, { cause: error });
  }
}
