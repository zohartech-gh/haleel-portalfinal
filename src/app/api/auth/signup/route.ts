import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, level } = await req.json();

    if (!name || !email || !password || !level) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["JHS", "SHS"].includes(level)) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, level, role: "STUDENT" },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      level: user.level,
    });

    const response = NextResponse.json({ success: true, level: user.level });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
