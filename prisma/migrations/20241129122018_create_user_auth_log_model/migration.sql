-- CreateEnum
CREATE TYPE "UserAuthLogType" AS ENUM ('LOGIN', 'REFRESH');

-- CreateTable
CREATE TABLE "UserAuthLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "UserAuthLogType" NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuthLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAuthLog" ADD CONSTRAINT "UserAuthLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuthLog" ADD CONSTRAINT "UserAuthLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
