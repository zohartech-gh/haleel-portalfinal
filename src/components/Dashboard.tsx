"use client";

import Link from "next/link";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface DashboardProps {
  level: "jhs" | "shs";
}

const JHS_SUBJECTS = [
  { name: "Mathematics", icon: "+" , color: "from-blue-500 to-blue-700" },
  { name: "English Language", icon: "Aa", color: "from-purple-500 to-purple-700" },
  { name: "Integrated Science", icon: "Sc", color: "from-emerald-500 to-emerald-700" },
  { name: "Social Studies", icon: "Ss", color: "from-amber-500 to-amber-700" },
  { name: "ICT", icon: "IT", color: "from-cyan-500 to-cyan-700" },
  { name: "RME", icon: "Re", color: "from-rose-500 to-rose-700" },
  { name: "French", icon: "Fr", color: "from-indigo-500 to-indigo-700" },
  { name: "Creative Arts", icon: "Ca", color: "from-pink-500 to-pink-700" },
  { name: "Career Technology", icon: "Ct", color: "from-teal-500 to-teal-700" },
];

const SHS_CORE = [
  { name: "Core Mathematics", icon: "+", color: "from-blue-500 to-blue-700" },
  { name: "English Language", icon: "Aa", color: "from-purple-500 to-purple-700" },
  { name: "Integrated Science", icon: "Sc", color: "from-emerald-500 to-emerald-700" },
  { name: "Social Studies", icon: "Ss", color: "from-amber-500 to-amber-700" },
];

const SHS_ELECTIVES = [
  { name: "Physics", icon: "Ph", color: "from-sky-500 to-sky-700" },
  { name: "Chemistry", icon: "Ch", color: "from-orange-500 to-orange-700" },
  { name: "Biology", icon: "Bi", color: "from-green-500 to-green-700" },
  { name: "Economics", icon: "Ec", color: "from-violet-500 to-violet-700" },
  { name: "Geography", icon: "Ge", color: "from-teal-500 to-teal-700" },
  { name: "Government", icon: "Gv", color: "from-red-500 to-red-700" },
  { name: "Literature", icon: "Li", color: "from-fuchsia-500 to-fuchsia-700" },
  { name: "Elective Mathematics", icon: "Em", color: "from-indigo-500 to-indigo-700" },
  { name: "Accounting", icon: "Ac", color: "from-yellow-500 to-yellow-700" },
];

export default function Dashboard({ level }: DashboardProps) {
  const { user, loading } = useUser();
  const isJHS = level === "jhs";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-gray-500 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const gradientFrom = isJHS ? "from-blue-600" : "from-emerald-600";
  const gradientVia = isJHS ? "via-blue-700" : "via-emerald-700";
  const gradientTo = isJHS ? "to-indigo-800" : "to-teal-800";

  const quickActions = [
    {
      label: "Practice",
      desc: "Past questions",
      href: `/${level}/practice`,
      gradient: "from-blue-500 to-blue-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
        </svg>
      ),
    },
    {
      label: "AI Practice",
      desc: "AI-generated Qs",
      href: `/${level}/ai-practice`,
      gradient: "from-purple-500 to-violet-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      ),
    },
    {
      label: `Mock ${isJHS ? "BECE" : "WASSCE"}`,
      desc: "Timed exam",
      href: `/${level}/mock`,
      gradient: "from-amber-500 to-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Subjects",
      desc: "Browse all",
      href: `/${level}/subjects`,
      gradient: "from-emerald-500 to-green-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      label: "Progress",
      desc: "View scores",
      href: `/${level}/progress`,
      gradient: "from-rose-500 to-pink-700",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
  ];

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} p-6 md:p-8 text-white shadow-xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-white/70 text-sm md:text-base">
              {isJHS ? "BECE" : "WASSCE"} Preparation Portal - Keep practicing to ace your exams.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="font-semibold text-sm text-gray-800">{action.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Subjects */}
        {isJHS ? (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">JHS Subjects</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {JHS_SUBJECTS.map((s) => (
                <Link
                  key={s.name}
                  href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                  className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}>
                    {s.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Core Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SHS_CORE.map((s) => (
                  <Link
                    key={s.name}
                    href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                    className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900">{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Elective Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SHS_ELECTIVES.map((s) => (
                  <Link
                    key={s.name}
                    href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                    className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900">{s.name}</span>
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
