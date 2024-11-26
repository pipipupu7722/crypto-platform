/*
  Warnings:

  - You are about to drop the column `isWithdrawable` on the `Cryptocurrency` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cryptocurrency" DROP COLUMN "isWithdrawable",
ADD COLUMN     "withdrawalLimit" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "txHash" DROP NOT NULL;
