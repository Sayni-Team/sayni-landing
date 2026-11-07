-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MERCADO_PAGO', 'CASH_ON_DELIVERY');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'COD_PENDING';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MERCADO_PAGO';
