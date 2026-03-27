import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSyllabus, getTopicsForSubject } from "@/lib/waec-syllabus";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const level = req.nextUrl.searchParams.get("level") as "JHS" | "SHS";
  const subject = req.nextUrl.searchParams.get("subject");

  if (!level || !["JHS", "SHS"].includes(level)) {
    return NextResponse.json({ error: "Valid level required" }, { status: 400 });
  }

  if (subject) {
    const topics = getTopicsForSubject(level, subject);
    return NextResponse.json({ subject, topics });
  }

  const syllabus = getSyllabus(level);
  return NextResponse.json(syllabus);
}
