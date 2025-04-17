/*
  Warnings:

  - The primary key for the `Bundle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Bundle` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `BundleProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `bundleId` on the `BundleProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `BundleProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bundle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shop" TEXT,
    "status" TEXT DEFAULT 'draft',
    "name" TEXT,
    "settings" JSONB
);
INSERT INTO "new_Bundle" ("createdAt", "id", "name", "settings", "shop", "status", "updatedAt") SELECT "createdAt", "id", "name", "settings", "shop", "status", "updatedAt" FROM "Bundle";
DROP TABLE "Bundle";
ALTER TABLE "new_Bundle" RENAME TO "Bundle";
CREATE TABLE "new_BundleProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundleId" INTEGER NOT NULL,
    "productId" TEXT,
    "name" TEXT,
    "quantity" INTEGER DEFAULT 1,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BundleProduct_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BundleProduct" ("bundleId", "createdAt", "id", "image", "name", "productId", "quantity", "updatedAt") SELECT "bundleId", "createdAt", "id", "image", "name", "productId", "quantity", "updatedAt" FROM "BundleProduct";
DROP TABLE "BundleProduct";
ALTER TABLE "new_BundleProduct" RENAME TO "BundleProduct";
CREATE INDEX "BundleProduct_bundleId_idx" ON "BundleProduct"("bundleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
