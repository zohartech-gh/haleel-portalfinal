import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { subject, mode, score, totalQuestions, timeSpent, level } = await req.json();

  const subjectRecord = await prisma.subject.findFirst({
    where: { name: subject, level },
  });

  if (!subjectRecord) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.userId,
      subjectId: subjectRecord.id,
      mode,
      score,
      totalQuestions,
      timeSpent: timeSpent || 0,
    },
  });

  return NextResponse.json(attempt);
}
