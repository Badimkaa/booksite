-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "telegramLink" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "lastModifiedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Chapter" ("content", "createdAt", "excerpt", "id", "lastModifiedBy", "published", "slug", "telegramLink", "title", "updatedAt", "videoUrl", "views") SELECT "content", "createdAt", "excerpt", "id", "lastModifiedBy", "published", "slug", "telegramLink", "title", "updatedAt", "videoUrl", "views" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
