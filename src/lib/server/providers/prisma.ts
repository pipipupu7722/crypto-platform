import { PrismaClient } from "@prisma/client"

import { NodeEnvs } from "../../types"
import { appconf } from "@/appconf"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

if (appconf.env !== NodeEnvs.Prod) {
    globalForPrisma.prisma = prisma
}

export { prisma }
