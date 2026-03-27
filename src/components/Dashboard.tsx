"use client";

import Link from "next/link";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface DashboardProps {
  level: "jhs" | "shs";
}

const JHS_SUBJECTS = [
  "Mathematics", "English Language", "Integrated Science", "Social Studies",
  "ICT", "RME", "French", "Creative Arts", "Career Technology",
];

const SHS_CORE = ["Core Mathematics", "English Language", "Integrated Science", "Social Studies"];
const SHS_ELECTIVES = [
  "Physics", "Chemistry", "Biology", "Economics",
  "Geography", "Government", "Literature", "Elective Mathematics", "Accounting",
];

export default function Dashboard({ level }: DashboardProps) {
  const { user, loading } = useUser();
  const isJHS = level === "jhs";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            {isJHS ? "BECE" : "WASSCE"} Preparation Portal
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link href={`/${level}/practice`} className={`card text-center hover:shadow-md transition-shadow ${isJHS ? "hover:border-blue-200" : "hover:border-emerald-200"}`}>
            <div className="text-2xl mb-1">&#9997;</div>
            <div className="font-semibold text-sm">Practice</div>
          </Link>
          <Link href={`/${level}/ai-practice`} className={`card text-center hover:shadow-md transition-shadow relative ${isJHS ? "hover:border-blue-200" : "hover:border-emerald-200"}`}>
            <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${isJHS ? "bg-blue-600" : "bg-emerald-600"}`}>AI</span>
            <div className="text-2xl mb-1">&#129302;</div>
            <div className="font-semibold text-sm">AI Practice</div>
          </Link>
          <Link href={`/${level}/mock`} className={`card text-center hover:shadow-md transition-shadow ${isJHS ? "hover:border-blue-200" : "hover:border-emerald-200"}`}>
            <div className="text-2xl mb-1">&#9202;</div>
            <div className="font-semibold text-sm">Mock {isJHS ? "BECE" : "WASSCE"}</div>
          </Link>
          <Link href={`/${level}/subjects`} className={`card text-center hover:shadow-md transition-shadow ${isJHS ? "hover:border-blue-200" : "hover:border-emerald-200"}`}>
            <div className="text-2xl mb-1">&#128218;</div>
            <div className="font-semibold text-sm">Subjects</div>
          </Link>
          <Link href={`/${level}/progress`} className={`card text-center hover:shadow-md transition-shadow ${isJHS ? "hover:border-blue-200" : "hover:border-emerald-200"}`}>
            <div className="text-2xl mb-1">&#128200;</div>
            <div className="font-semibold text-sm">Progress</div>
          </Link>
        </div>

        {/* Subjects */}
        {isJHS ? (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">JHS Subjects</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {JHS_SUBJECTS.map((s) => (
                <Link
                  key={s}
                  href={`/${level}/practice?subject=${encodeURIComponent(s)}`}
                  className="card hover:shadow-md hover:border-blue-200 transition-all text-sm font-medium"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Core Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SHS_CORE.map((s) => (
                  <Link
                    key={s}
                    href={`/${level}/practice?subject=${encodeURIComponent(s)}`}
                    className="card hover:shadow-md hover:border-emerald-200 transition-all text-sm font-medium"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Elective Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SHS_ELECTIVES.map((s) => (
                  <Link
                    key={s}
                    href={`/${level}/practice?subject=${encodeURIComponent(s)}`}
                    className="card hover:shadow-md hover:border-emerald-200 transition-all text-sm font-medium"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
