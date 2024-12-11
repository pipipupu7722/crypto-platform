/*
  Warnings:

  - You are about to drop the column `cardCurrency` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_crypto_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "cardCurrency",
ALTER COLUMN "crypto" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_crypto_fkey" FOREIGN KEY ("crypto") REFERENCES "Cryptocurrency"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;
