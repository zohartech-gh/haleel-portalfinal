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
  const topic = req.nextUrl.searchParams.get("topic");
  const difficulty = req.nextUrl.searchParams.get("difficulty");
  const countParam = req.nextUrl.searchParams.get("count");

  if (!level || !subject) {
    return NextResponse.json({ error: "level and subject required" }, { status: 400 });
  }

  const subjectRecord = await prisma.subject.findFirst({
    where: { name: subject, level: level as "JHS" | "SHS" },
  });

  if (!subjectRecord) {
    return NextResponse.json([]);
  }

  // Session sizes: mock=40, practice=30 (configurable via ?count=)
  const defaultCount = mode === "mock" ? 40 : 30;
  const take = countParam ? Math.min(parseInt(countParam) || defaultCount, 60) : defaultCount;

  // Build filter
  const where: any = {
    subjectId: subjectRecord.id,
    level: level as "JHS" | "SHS",
  };

  if (topic) {
    where.topic = topic;
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  // Get total count for this subject to randomize properly
  const totalQuestions = await prisma.question.count({ where });

  if (totalQuestions === 0) {
    return NextResponse.json([]);
  }

  // Randomly select questions for a fresh session each time
  // Use a random skip offset to get different questions each session
  let questions;

  if (totalQuestions <= take) {
    // Not enough questions — return all, shuffled
    questions = await prisma.question.findMany({
      where,
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
  } else {
    // Fetch more than needed, then randomly sample
    const allIds = await prisma.question.findMany({
      where,
      select: { id: true },
    });

    // Fisher-Yates shuffle and take first `take` IDs
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, take).map((q) => q.id);

    questions = await prisma.question.findMany({
      where: { id: { in: selectedIds } },
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
  }

  // Shuffle final order
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  return NextResponse.json(shuffledQuestions);
}
