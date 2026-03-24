import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
  if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  const question = await prisma.question.update({
    where: { id },
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
