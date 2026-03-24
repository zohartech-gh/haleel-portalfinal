import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get("level");
  if (!level || !["JHS", "SHS"].includes(level)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  const subjects = await prisma.subject.findMany({
    where: { level: level as "JHS" | "SHS" },
    include: { _count: { select: { questions: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(subjects);
}
