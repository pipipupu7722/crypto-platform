-- CreateEnum
CREATE TYPE "TradeRobotStatus" AS ENUM ('AVAILABLE', 'ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "TradeRobot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "invested" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fakeProfitMin" DOUBLE PRECISION NOT NULL,
    "fakeProfitMax" DOUBLE PRECISION NOT NULL,
    "realProfitMin" DOUBLE PRECISION NOT NULL,
    "realProfitMax" DOUBLE PRECISION NOT NULL,
    "status" "TradeRobotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "startedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closesAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeRobot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeRobotPnl" (
    "id" TEXT NOT NULL,
    "tradeRobotId" TEXT NOT NULL,
    "profitDelta" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeRobotPnl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TradeRobot" ADD CONSTRAINT "TradeRobot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeRobotPnl" ADD CONSTRAINT "TradeRobotPnl_tradeRobotId_fkey" FOREIGN KEY ("tradeRobotId") REFERENCES "TradeRobot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
