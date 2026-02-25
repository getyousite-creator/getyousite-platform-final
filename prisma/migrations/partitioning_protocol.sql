-- SOVEREIGN ANALYTICS PARTITIONING PROTOCOL
-- Optimized for high-frequency event storage

-- 1. Create the master table
CREATE TABLE "Analytics_Partitioned" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "country" TEXT,
    "city" TEXT,
    "path" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_Partitioned_pkey" PRIMARY KEY ("id", "createdAt")
) PARTITION BY RANGE ("createdAt");

-- 2. Create initial partitions
CREATE TABLE "Analytics_2026_Q1" PARTITION OF "Analytics_Partitioned"
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE "Analytics_2026_Q2" PARTITION OF "Analytics_Partitioned"
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

-- 3. Indexes on each partition (Automated by PSQL 11+)
CREATE INDEX "Analytics_siteId_idx" ON "Analytics_Partitioned" ("siteId");
CREATE INDEX "Analytics_eventType_idx" ON "Analytics_Partitioned" ("eventType");
