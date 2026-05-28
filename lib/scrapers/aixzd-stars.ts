import { scrapeAixzdCollection } from "@/lib/scrapers/aixzd-shared";

export async function scrapeAixzdStars() {
  return scrapeAixzdCollection("https://aixzd.com/rank/stars");
}
