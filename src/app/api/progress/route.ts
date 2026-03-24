import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const level = req.nextUrl.searchParams.get("level");

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: session.userId,
      subject: { level: level as "JHS" | "SHS" },
    },
    include: { subject: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalAttempts = attempts.length;

  if (totalAttempts === 0) {
    return NextResponse.json({
      totalAttempts: 0,
      averageScore: 0,
      bestSubject: null,
      weakSubject: null,
      recentAttempts: [],
    });
  }

  const averageScore = Math.round(
    (attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0)) / totalAttempts
  );

  // Group by subject
  const subjectScores: Record<string, { total: number; count: number }> = {};
  for (const a of attempts) {
    const name = a.subject.name;
    if (!subjectScores[name]) subjectScores[name] = { total: 0, count: 0 };
    subjectScores[name].total += (a.score / a.totalQuestions) * 100;
    subjectScores[name].count++;
  }

  const subjectAvgs = Object.entries(subjectScores).map(([name, { total, count }]) => ({
    name,
    avg: total / count,
  }));

  subjectAvgs.sort((a, b) => b.avg - a.avg);
  const bestSubject = subjectAvgs[0]?.name || null;
  const weakSubject = subjectAvgs[subjectAvgs.length - 1]?.name || null;

  const recentAttempts = attempts.slice(0, 10).map((a) => ({
    id: a.id,
    subject: a.subject.name,
    mode: a.mode,
    score: a.score,
    totalQuestions: a.totalQuestions,
    timeSpent: a.timeSpent,
    createdAt: a.createdAt.toISOString(),
  }));

  return NextResponse.json({
    totalAttempts,
    averageScore,
    bestSubject,
    weakSubject,
    recentAttempts,
  });
}
