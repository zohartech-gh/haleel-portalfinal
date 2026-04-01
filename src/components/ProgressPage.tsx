"use client";

import { useEffect, useState } from "react";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface ProgressPageProps {
  level: "jhs" | "shs";
}

interface Stats {
  totalAttempts: number;
  averageScore: number;
  bestSubject: string | null;
  weakSubject: string | null;
  recentAttempts: {
    id: string;
    subject: string;
    mode: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    createdAt: string;
  }[];
}

export default function ProgressPage({ level }: ProgressPageProps) {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const isJHS = level === "jhs";

  const accentGradient = isJHS ? "from-blue-600 to-indigo-800" : "from-emerald-600 to-teal-800";

  useEffect(() => {
    fetch(`/api/progress?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [level]);

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" /><span className="text-gray-500">Loading...</span></div></div>;
  if (!user) return null;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Your Progress</h1>
          <p className="text-gray-500 mt-1">Track your performance across all subjects</p>
        </div>

        {!stats ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : stats.totalAttempts === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700">No quizzes taken yet</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">Start practicing to see your progress, scores, and improvement over time.</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                </div>
                <div className="text-2xl font-extrabold text-gray-800">{stats.totalAttempts}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Quizzes Taken</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div className="text-2xl font-extrabold text-gray-800">{stats.averageScore}%</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Average Score</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                </div>
                <div className="text-sm font-extrabold text-gray-800 truncate px-1">{stats.bestSubject || "N/A"}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Best Subject</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div className="text-sm font-extrabold text-gray-800 truncate px-1">{stats.weakSubject || "N/A"}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Needs Work</div>
              </div>
            </div>

            {/* Recent Results */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Results</h2>
              <div className="space-y-3">
                {stats.recentAttempts.map((a) => {
                  const pct = Math.round((a.score / a.totalQuestions) * 100);
                  const isGood = pct >= 70;
                  const isOk = pct >= 50;
                  return (
                    <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md ${
                            isGood ? "bg-gradient-to-br from-green-500 to-green-700" : isOk ? "bg-gradient-to-br from-amber-500 to-amber-700" : "bg-gradient-to-br from-red-500 to-red-700"
                          }`}>
                            {pct}%
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{a.subject}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                a.mode === "MOCK" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                              }`}>
                                {a.mode === "MOCK" ? "Mock Exam" : "Practice"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(a.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-lg text-gray-800">{a.score}/{a.totalQuestions}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
