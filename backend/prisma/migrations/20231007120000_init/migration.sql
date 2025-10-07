-- Create tables matching Prisma schema for SQLite/PostgreSQL compatibility
CREATE TABLE "Narrative" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "logline" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Character" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "archetype" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "narrativeId" TEXT NOT NULL,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Episode" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "beats" TEXT NOT NULL,
  "publishedAt" DATETIME,
  "narrativeId" TEXT NOT NULL,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Poll" (
  "id" TEXT PRIMARY KEY,
  "question" TEXT NOT NULL,
  "episodeId" TEXT,
  "narrativeId" TEXT NOT NULL,
  FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PollOption" (
  "id" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "votes" INTEGER NOT NULL DEFAULT 0,
  "pollId" TEXT NOT NULL,
  FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Engagement" (
  "id" TEXT PRIMARY KEY,
  "channel" TEXT NOT NULL,
  "impressions" INTEGER NOT NULL,
  "clicks" INTEGER NOT NULL,
  "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "narrativeId" TEXT NOT NULL,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Prompt" (
  "id" TEXT PRIMARY KEY,
  "version" INTEGER NOT NULL DEFAULT 1,
  "content" TEXT NOT NULL,
  "embedding" TEXT,
  "narrativeId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ApprovalRequest" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "narrativeId" TEXT NOT NULL,
  "promptId" TEXT,
  "reviewerEmail" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approvedAt" DATETIME,
  FOREIGN KEY ("narrativeId") REFERENCES "Narrative"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Episode_narrativeId_idx" ON "Episode" ("narrativeId");
CREATE INDEX "Poll_narrativeId_idx" ON "Poll" ("narrativeId");
CREATE INDEX "Engagement_narrativeId_idx" ON "Engagement" ("narrativeId");
CREATE INDEX "Prompt_narrativeId_idx" ON "Prompt" ("narrativeId");
CREATE INDEX "ApprovalRequest_narrativeId_idx" ON "ApprovalRequest" ("narrativeId");
