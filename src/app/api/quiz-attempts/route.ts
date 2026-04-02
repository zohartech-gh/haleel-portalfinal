import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { subject, mode, score, totalQuestions, timeSpent, level, answers } = await req.json();

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

  // Save individual answers if provided
  if (answers && Array.isArray(answers) && answers.length > 0) {
    await prisma.quizAnswer.createMany({
      data: answers.map((a: { questionId: string; selectedOption: string; isCorrect: boolean }) => ({
        attemptId: attempt.id,
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        isCorrect: a.isCorrect,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(attempt);
}
