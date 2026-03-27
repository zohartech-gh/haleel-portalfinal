"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface PortalLayoutProps {
  level: "jhs" | "shs";
  userName: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "dashboard", icon: "\u2302" },
  { label: "Subjects", path: "subjects", icon: "\u{1F4DA}" },
  { label: "Practice", path: "practice", icon: "\u270F" },
  { label: "AI Practice", path: "ai-practice", icon: "\u{1F916}" },
  { label: "Mock Exam", path: "mock", icon: "\u23F0" },
  { label: "Progress", path: "progress", icon: "\u{1F4CA}" },
];

export default function PortalLayout({ level, userName, children }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isJHS = level === "jhs";
  const accent = isJHS ? "blue" : "emerald";
  const examLabel = isJHS ? "BECE" : "WASSCE";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3">
        <Link href={`/${level}/dashboard`} className="font-bold text-lg text-blue-700">
          haleel<span className="text-emerald-600">.org</span>
          <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded bg-${accent}-100 text-${accent}-700`}>
            {level.toUpperCase()}
          </span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen`}>
        <div className="hidden md:block p-6 border-b">
          <Link href={`/${level}/dashboard`} className="font-bold text-lg text-blue-700">
            haleel<span className="text-emerald-600">.org</span>
          </Link>
          <div className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded ${isJHS ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
            {level.toUpperCase()} - {examLabel}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const href = `/${level}/${item.path}`;
            const active = pathname === href;
            return (
              <Link
                key={item.path}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? isJHS
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-4">
          <div className="text-sm text-gray-500 mb-2">
            Signed in as <span className="font-medium text-gray-700">{userName}</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
