import { scrapeAixzdCollection } from "@/lib/scrapers/aixzd-shared";
import { getMonthSlug } from "@/lib/utils/getMonthSlug";

export async function scrapeAixzdMonth() {
  const slug = getMonthSlug();
  return scrapeAixzdCollection(`https://aixzd.com/rank/month/${slug}`);
}
