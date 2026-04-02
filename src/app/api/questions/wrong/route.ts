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
  const shouldFetch = req.nextUrl.searchParams.get("fetch");

  if (!level || !subject) {
    return NextResponse.json({ error: "level and subject required" }, { status: 400 });
  }

  const subjectRecord = await prisma.subject.findFirst({
    where: { name: subject, level: level as "JHS" | "SHS" },
  });

  if (!subjectRecord) {
    return NextResponse.json({ count: 0, questions: [] });
  }

  // Find all questions this user got wrong (most recent answer per question)
  // Group by questionId, only include questions where last answer was wrong
  const wrongAnswers = await prisma.quizAnswer.findMany({
    where: {
      isCorrect: false,
      attempt: {
        userId: session.userId,
        subjectId: subjectRecord.id,
      },
    },
    select: {
      questionId: true,
    },
    orderBy: {
      attempt: { createdAt: "desc" },
    },
  });

  // Get unique question IDs that were answered incorrectly
  const wrongQuestionIds = [...new Set(wrongAnswers.map((a) => a.questionId))];

  // Exclude questions the user later answered correctly
  const correctAnswers = await prisma.quizAnswer.findMany({
    where: {
      isCorrect: true,
      questionId: { in: wrongQuestionIds },
      attempt: {
        userId: session.userId,
        subjectId: subjectRecord.id,
      },
    },
    select: {
      questionId: true,
    },
    orderBy: {
      attempt: { createdAt: "desc" },
    },
  });

  // For each question, check if the MOST RECENT answer was correct
  // If so, remove from wrong list (they've mastered it)
  const masteredIds = new Set<string>();
  for (const qId of wrongQuestionIds) {
    const lastCorrect = correctAnswers.find((a) => a.questionId === qId);
    const lastWrong = wrongAnswers.find((a) => a.questionId === qId);
    // If they have a correct answer more recently, they've mastered it
    // Since both are ordered by desc, we use the raw arrays
    // Simple approach: check if they ever got it right after getting it wrong
    if (lastCorrect) {
      // Check timestamps - get latest correct and latest wrong for this question
      masteredIds.add(qId); // We'll do a simpler check below
    }
  }

  // Simpler approach: questions that were EVER wrong and not yet mastered
  // A question is "mastered" if the user's most recent attempt at it was correct
  const stillWrongIds: string[] = [];
  for (const qId of wrongQuestionIds) {
    const latestAnswer = await prisma.quizAnswer.findFirst({
      where: {
        questionId: qId,
        attempt: {
          userId: session.userId,
        },
      },
      orderBy: {
        attempt: { createdAt: "desc" },
      },
      select: { isCorrect: true },
    });
    if (latestAnswer && !latestAnswer.isCorrect) {
      stillWrongIds.push(qId);
    }
  }

  // If just counting (no fetch param), return count
  if (!shouldFetch) {
    return NextResponse.json({ count: stillWrongIds.length });
  }

  // Fetch the actual questions
  if (stillWrongIds.length === 0) {
    return NextResponse.json({ count: 0, questions: [] });
  }

  const take = Math.min(stillWrongIds.length, 30);
  // Shuffle and take
  const shuffled = stillWrongIds.sort(() => Math.random() - 0.5).slice(0, take);

  const questions = await prisma.question.findMany({
    where: { id: { in: shuffled } },
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
      difficulty: true,
    },
  });

  // Shuffle final order
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  return NextResponse.json({ count: stillWrongIds.length, questions: shuffledQuestions });
}
