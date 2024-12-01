-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "description" TEXT,
ALTER COLUMN "invested" SET DEFAULT 0,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "closedAt" DROP NOT NULL;
