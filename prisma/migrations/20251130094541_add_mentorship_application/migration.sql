-- CreateTable
CREATE TABLE "MentorshipApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stateOneWord" TEXT NOT NULL,
    "bodyMessage" TEXT NOT NULL,
    "mainFeeling" TEXT NOT NULL,
    "butterflyStage" TEXT NOT NULL,
    "relations" TEXT NOT NULL,
    "familySupport" TEXT,
    "supportNeeded" TEXT NOT NULL,
    "preferredFormat" TEXT NOT NULL,
    "contactLevel" TEXT NOT NULL,
    "personalMessage" TEXT,
    "telegram" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
