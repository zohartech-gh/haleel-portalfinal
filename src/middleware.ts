import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "haleel-secret-change-me"
);

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  level: string;
}

async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
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

  const payload = await verifyTokenEdge(token);
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
      return NextResponse.redirect(new URL("/shs/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // SHS routes - only SHS users
  if (pathname.startsWith("/shs")) {
    if (payload.level !== "SHS") {
      return NextResponse.redirect(new URL("/jhs/dashboard", request.url));
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
