import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const total = await p.question.count();
  console.log("TOTAL QUESTIONS: " + total);
  const subjects = await p.subject.findMany({ include: { _count: { select: { questions: true } } }, orderBy: { name: "asc" } });
  for (const s of subjects) {
    if (s._count.questions > 0) console.log("  " + s.name + " (" + s.level + "): " + s._count.questions);
  }
  await p.$disconnect();
}
main();
