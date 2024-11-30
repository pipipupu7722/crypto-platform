/*
  Warnings:

  - You are about to drop the column `withdrawalLimit` on the `Cryptocurrency` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cryptocurrency" DROP COLUMN "withdrawalLimit",
ADD COLUMN     "withdrawalMaxUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "withdrawalMinUsd" DOUBLE PRECISION NOT NULL DEFAULT 0;
