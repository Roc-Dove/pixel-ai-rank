import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { getServerEnv } from "@/lib/env";
import { type RawRankItem } from "@/types/rank";
import { sanitizeText, safeSlice } from "@/lib/utils/scrape";

async function resolveExecutablePath() {
  const env = getServerEnv();
  if (env.PUPPETEER_EXECUTABLE_PATH) return env.PUPPETEER_EXECUTABLE_PATH;
  if (process.platform !== "linux") return undefined;
  try {
    return await chromium.executablePath();
  } catch {
    return undefined;
  }
}

export async function scrapeXhunt(group: "cn" | "all"): Promise<RawRankItem[]> {
  const executablePath = await resolveExecutablePath();
  if (!executablePath) {
    throw new Error("本地未配置 PUPPETEER_EXECUTABLE_PATH，xhunt 抓取已跳过");
  }
  const launchArgs = process.platform === "linux" ? chromium.args : [];

  const browser = await puppeteer.launch({
    executablePath,
    args: launchArgs,
    defaultViewport: { width: 1440, height: 1200 },
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
    await page.goto(`https://kol.xhunt.ai/rank?tab=kol&group=${group}&domain=ai`, {
      waitUntil: "networkidle2",
      timeout: 45000,
    });
    await page.waitForSelector('[data-slot="card"]', { timeout: 15000 });

    const items = await page.evaluate((currentGroup) => {
      const cards = Array.from(document.querySelectorAll('[data-slot="card"]'));

      return cards.map((card, index) => {
        const text = card.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const profileLink = card.querySelector<HTMLAnchorElement>('a[href^="/info/"]');
        const image = card.querySelector<HTMLImageElement>('img[alt="image"]');
        const name = card.querySelector("h3")?.textContent?.trim() ?? "";
        const handle =
          Array.from(card.querySelectorAll("span"))
            .map((node) => node.textContent?.trim() ?? "")
            .find((value) => value.startsWith("@")) ?? null;
        const description =
          card.querySelector("div.text-xs.text-gray-400.line-clamp-2.break-all")?.textContent?.replace(/\s+/g, " ").trim() ??
          Array.from(card.querySelectorAll("div"))
            .map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "")
            .find((value) => value.length > 20 && !value.startsWith("@") && !value.includes("关注者") && !value.includes("Followers") && !value.includes("排名") && !value.includes("Rank")) ??
          null;

        const rankMatch = text.match(/(\d{1,3})\s*(?:排名|Rank)/i);
        const followersMatch = text.match(/(\d+(?:\.\d+)?[KMB]?)\s*(?:关注者|Followers)/i);
        const href = profileLink?.getAttribute("href") ?? null;
        const absoluteHref = href ? new URL(href, "https://kol.xhunt.ai").toString() : "https://kol.xhunt.ai";

        return {
          rank: rankMatch ? Number.parseInt(rankMatch[1], 10) : index + 1,
          name,
          description,
          logoUrl: image?.getAttribute("src") ?? null,
          externalLink: absoluteHref,
          detailLink: absoluteHref,
          metricPrimary: followersMatch?.[1] ?? null,
          metricSecondary: handle,
          metricTertiary: currentGroup === "cn" ? "CN" : "Global",
        };
      });
    }, group);

    return safeSlice(
      items
        .map((item) => ({
          ...item,
          name: sanitizeText(item.name) || "",
          description: sanitizeText(item.description),
          logoUrl: sanitizeText(item.logoUrl),
          externalLink: sanitizeText(item.externalLink) || "https://kol.xhunt.ai",
          detailLink: sanitizeText(item.detailLink),
          metricPrimary: sanitizeText(item.metricPrimary),
          metricSecondary: sanitizeText(item.metricSecondary),
          metricTertiary: sanitizeText(item.metricTertiary),
        }))
        .filter((item) => item.name),
      50,
    );
  } catch {
    return [];
  } finally {
    await browser.close();
  }
}
