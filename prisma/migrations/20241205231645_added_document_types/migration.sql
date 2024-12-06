-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID', 'SELFIE');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'ID';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "idType" TEXT;
