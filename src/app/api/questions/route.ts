import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const level = req.nextUrl.searchParams.get("level");
  const subject = req.nextUrl.searchParams.get("subject");
  const mode = req.nextUrl.searchParams.get("mode");

  if (!level || !subject) {
    return NextResponse.json({ error: "level and subject required" }, { status: 400 });
  }

  const subjectRecord = await prisma.subject.findFirst({
    where: { name: subject, level: level as "JHS" | "SHS" },
  });

  if (!subjectRecord) {
    return NextResponse.json([]);
  }

  const take = mode === "mock" ? 20 : 10;

  const questions = await prisma.question.findMany({
    where: { subjectId: subjectRecord.id, level: level as "JHS" | "SHS" },
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      questionText: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      correctOption: true,
      explanation: true,
      topic: true,
      year: true,
    },
  });

  return NextResponse.json(questions);
}
