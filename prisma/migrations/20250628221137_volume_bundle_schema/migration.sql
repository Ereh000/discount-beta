-- CreateTable
CREATE TABLE "VolumeDiscount" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "bundleName" TEXT,
    "settings" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolumeDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolumeDiscount_shop_key" ON "VolumeDiscount"("shop");
