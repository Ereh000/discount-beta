-- CreateEnum
CREATE TYPE "AnalyticType" AS ENUM ('IMPRESSION', 'ADD_TO_CART', 'ORDER');

-- CreateTable
CREATE TABLE "BundleAnalytics" (
    "id" SERIAL NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "type" "AnalyticType" NOT NULL,
    "bundleId" TEXT NOT NULL,
    "bundleName" TEXT,
    "orderId" TEXT,
    "orderNumber" TEXT,
    "customerId" TEXT,
    "revenue" DOUBLE PRECISION,
    "productIds" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BundleAnalytics_shopDomain_type_idx" ON "BundleAnalytics"("shopDomain", "type");

-- CreateIndex
CREATE INDEX "BundleAnalytics_bundleId_idx" ON "BundleAnalytics"("bundleId");

-- CreateIndex
CREATE INDEX "BundleAnalytics_timestamp_idx" ON "BundleAnalytics"("timestamp");
