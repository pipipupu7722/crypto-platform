import { PrismaClient } from "@prisma/client"

import { appconf } from "@/appconf"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

if (appconf.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export { prisma }
