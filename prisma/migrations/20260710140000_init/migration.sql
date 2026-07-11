-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RankType" AS ENUM ('AICPB', 'AIXZD_STARS', 'AIXZD_MONTH', 'XHUNT_CN', 'XHUNT_GLOBAL');

-- CreateTable
CREATE TABLE "RankItem" (
    "id" TEXT NOT NULL,
    "rankType" "RankType" NOT NULL,
    "rank" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "externalLink" TEXT NOT NULL,
    "detailLink" TEXT,
    "metricPrimary" TEXT,
    "metricSecondary" TEXT,
    "metricTertiary" TEXT,
    "batchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeBatch" (
    "id" TEXT NOT NULL,
    "rankType" "RankType" NOT NULL,
    "status" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "errorMsg" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RankItem_rankType_batchId_idx" ON "RankItem"("rankType", "batchId");

-- CreateIndex
CREATE INDEX "RankItem_batchId_idx" ON "RankItem"("batchId");

-- CreateIndex
CREATE INDEX "ScrapeBatch_rankType_status_idx" ON "ScrapeBatch"("rankType", "status");

-- CreateIndex
CREATE INDEX "ScrapeBatch_rankType_scrapedAt_idx" ON "ScrapeBatch"("rankType", "scrapedAt" DESC);

-- AddForeignKey
ALTER TABLE "RankItem" ADD CONSTRAINT "RankItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ScrapeBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
