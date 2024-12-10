import { PrismaClient } from "@prisma/client"
import { join } from "path"

import { readdir } from "fs/promises"

const prisma = new PrismaClient()

;(async () => {
    try {
        const seedersPath = join(__dirname, "./seeders")
        const seederFiles = await readdir(seedersPath)

        for (const file of seederFiles) {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
                const seederPath = join(seedersPath, file)
                const { default: seed } = await import(seederPath)

                if (await prisma.seeder.findFirst({ where: { name: file } })) {
                    console.log(`\n🌱  Skipping seeder ${file}: Already applied.`)
                } else if (typeof seed === "function") {
                    console.log(`\n🌱  Running seeder ${file}`)

                    const seeder = await prisma.seeder.create({ data: { name: file } })

                    await seed(prisma)

                    await prisma.seeder.update({ where: { id: seeder.id }, data: { finishedAt: new Date() } })

                    console.log(`🌱  Completed seeder ${file}`)
                } else {
                    console.warn(`⚠️  Skipping ${file}: No default export function found.`)
                }
            } else {
                console.warn(`⚠️  Skipping ${file}: Not a TypeScript or JavaScript file.`)
            }
        }
    } catch (error) {
        console.error("❌  Error during seeding:", error)
    } finally {
        await prisma.$disconnect()
    }
})()
