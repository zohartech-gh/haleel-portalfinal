import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const level = req.nextUrl.searchParams.get("level");
  const subjectId = req.nextUrl.searchParams.get("subjectId");

  const where: Record<string, unknown> = {};
  if (level && level !== "ALL") where.level = level;
  if (subjectId && subjectId !== "ALL") where.subjectId = subjectId;

  const questions = await prisma.question.findMany({
    where,
    include: { subject: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
  if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  const question = await prisma.question.create({
    data: {
      level: subject.level,
      examType: subject.examType,
      subjectId: data.subjectId,
      topic: data.topic,
      year: data.year,
      questionText: data.questionText,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      optionD: data.optionD,
      correctOption: data.correctOption,
      explanation: data.explanation,
      difficulty: data.difficulty || "MEDIUM",
    },
  });

  return NextResponse.json(question);
}
