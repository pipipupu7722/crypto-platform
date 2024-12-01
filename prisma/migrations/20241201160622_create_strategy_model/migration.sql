/*
  Warnings:

  - A unique constraint covering the columns `[userId,crypto,status]` on the table `DepositAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StrategyStatus" AS ENUM ('AVAILABLE', 'ACTIVE', 'CLOSED');

-- DropIndex
DROP INDEX "DepositAddress_userId_crypto_wallet_status_key";

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invested" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fakeProfitMin" DOUBLE PRECISION NOT NULL,
    "fakeProfitMax" DOUBLE PRECISION NOT NULL,
    "realProfitMin" DOUBLE PRECISION NOT NULL,
    "realProfitMax" DOUBLE PRECISION NOT NULL,
    "status" "StrategyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyPnl" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "profitDelta" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyPnl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositAddress_userId_crypto_status_key" ON "DepositAddress"("userId", "crypto", "status");

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyPnl" ADD CONSTRAINT "StrategyPnl_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
