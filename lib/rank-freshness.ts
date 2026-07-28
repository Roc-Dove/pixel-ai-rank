import { type SourceStatus } from "@/types/rank";

export const RANK_DATA_STALE_AFTER_MS = 72 * 60 * 60 * 1000;

type BatchSummary = {
  status: string;
  scrapedAt: Date;
};

export function isRankDataStale(scrapedAt: Date, now = Date.now()) {
  const timestamp = scrapedAt.getTime();
  return !Number.isFinite(timestamp) || now - timestamp > RANK_DATA_STALE_AFTER_MS;
}

export function getSuccessfulBatchStatus(
  successfulAt: Date,
  latestBatch: BatchSummary | null,
  now = Date.now(),
): SourceStatus {
  if (isRankDataStale(successfulAt, now)) return "stale";

  if (latestBatch?.status === "failed" && latestBatch.scrapedAt > successfulAt) {
    return "degraded";
  }

  return "ready";
}
