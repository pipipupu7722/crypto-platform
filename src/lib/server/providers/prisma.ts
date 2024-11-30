import { PrismaClient } from "@prisma/client"

import { appconf } from "@/appconf"
import { NodeEnvs } from "@/lib/types"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

if (appconf.env !== NodeEnvs.Prod) {
    globalForPrisma.prisma = prisma
}

export { prisma }
