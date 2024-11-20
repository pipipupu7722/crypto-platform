import { NodeEnvs } from "../types"
import { appconf } from "@/appconf"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

if (appconf.env !== NodeEnvs.Prod) {
    globalForPrisma.prisma = prisma
}

export { prisma }
