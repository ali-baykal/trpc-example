-- CreateTable
CREATE TABLE "DBTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "original" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "initiatedById" INTEGER NOT NULL,
    "lastUpdatedById" INTEGER,
    "type" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    CONSTRAINT "DBTranslation_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "DBAuthor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DBTranslation_lastUpdatedById_fkey" FOREIGN KEY ("lastUpdatedById") REFERENCES "DBAuthor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DBAuthor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
