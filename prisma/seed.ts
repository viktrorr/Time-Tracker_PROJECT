import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const projects = [
    { name: "Internal", client: null, colorHex: "#334155" },
    { name: "Acme Website", client: "Acme Corp", colorHex: "#2563EB" },
    { name: "Mobile App", client: "Globex", colorHex: "#16A34A" }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { name: project.name },
      update: {
        client: project.client,
        colorHex: project.colorHex,
        archived: false
      },
      create: project
    });
  }

  const taskNames = [
    { name: "Daily standup", normalized: "daily standup", usageCount: 12 },
    { name: "Code review", normalized: "code review", usageCount: 8 },
    { name: "Feature implementation", normalized: "feature implementation", usageCount: 15 },
    { name: "Bug fixing", normalized: "bug fixing", usageCount: 10 }
  ];

  for (const task of taskNames) {
    await prisma.taskName.upsert({
      where: { normalized: task.normalized },
      update: {
        name: task.name,
        usageCount: task.usageCount,
        lastUsedAt: new Date()
      },
      create: {
        ...task,
        lastUsedAt: new Date()
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
