-- CreateTable
CREATE TABLE "_custom_seeders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_custom_seeders_pkey" PRIMARY KEY ("id")
);
