/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "meta" JSONB NOT NULL DEFAULT '{}';

-- DropEnum
DROP TYPE "NotificationType";
