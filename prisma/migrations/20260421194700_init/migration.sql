-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "client" TEXT,
    "colorHex" TEXT NOT NULL DEFAULT '#64748B',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaskName" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskName" TEXT NOT NULL,
    "taskNameNorm" TEXT NOT NULL,
    "taskNameId" TEXT,
    "projectId" TEXT,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "isRunning" BOOLEAN NOT NULL DEFAULT true,
    "entryDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TimeEntry_taskNameId_fkey" FOREIGN KEY ("taskNameId") REFERENCES "TaskName" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Project_archived_idx" ON "Project"("archived");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TaskName_normalized_key" ON "TaskName"("normalized");

-- CreateIndex
CREATE INDEX "TaskName_usageCount_lastUsedAt_idx" ON "TaskName"("usageCount", "lastUsedAt");

-- CreateIndex
CREATE INDEX "TimeEntry_isRunning_startedAt_idx" ON "TimeEntry"("isRunning", "startedAt");

-- CreateIndex
CREATE INDEX "TimeEntry_entryDate_idx" ON "TimeEntry"("entryDate");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_entryDate_idx" ON "TimeEntry"("projectId", "entryDate");

-- CreateIndex
CREATE INDEX "TimeEntry_taskNameNorm_entryDate_idx" ON "TimeEntry"("taskNameNorm", "entryDate");
