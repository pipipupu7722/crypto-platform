/*
  Warnings:

  - Added the required column `closesAt` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StrategyPnl" DROP CONSTRAINT "StrategyPnl_strategyId_fkey";

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "closesAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "StrategyPnl" ADD CONSTRAINT "StrategyPnl_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
