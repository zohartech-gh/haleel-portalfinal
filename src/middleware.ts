import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/about" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/ai-practice") ||
    pathname.startsWith("/api/ai-explain") ||
    pathname.startsWith("/api/syllabus")
  ) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // JHS routes - only JHS users
  if (pathname.startsWith("/jhs")) {
    if (payload.level !== "JHS") {
      return NextResponse.redirect(new URL(`/shs/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // SHS routes - only SHS users
  if (pathname.startsWith("/shs")) {
    if (payload.level !== "SHS") {
      return NextResponse.redirect(new URL(`/jhs/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
