-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('LIMA_DELIVERY', 'SHALOM');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingZoneId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "city" TEXT,
ADD COLUMN     "pickupDni" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "shalomAgency" TEXT,
ADD COLUMN     "shippingMethod" "ShippingMethod" NOT NULL DEFAULT 'LIMA_DELIVERY',
ALTER COLUMN "shippingZoneId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingZoneId_fkey" FOREIGN KEY ("shippingZoneId") REFERENCES "ShippingZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
