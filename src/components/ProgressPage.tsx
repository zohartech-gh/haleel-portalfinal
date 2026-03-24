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

  useEffect(() => {
    fetch(`/api/progress?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [level]);

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user) return null;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

        {!stats ? (
          <div className="text-gray-400">Loading stats...</div>
        ) : stats.totalAttempts === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes taken yet.</p>
            <p className="text-gray-400 text-sm mt-1">Start practicing to see your progress here!</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-500">Quizzes Taken</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.averageScore}%</div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <div className="card text-center">
                <div className="text-lg font-bold text-green-600 truncate">{stats.bestSubject || "N/A"}</div>
                <div className="text-sm text-gray-500">Best Subject</div>
              </div>
              <div className="card text-center">
                <div className="text-lg font-bold text-amber-600 truncate">{stats.weakSubject || "N/A"}</div>
                <div className="text-sm text-gray-500">Needs Work</div>
              </div>
            </div>

            {/* Recent Results */}
            <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
            <div className="space-y-3">
              {stats.recentAttempts.map((a) => (
                <div key={a.id} className="card flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.subject}</div>
                    <div className="text-xs text-gray-400">
                      {a.mode === "MOCK" ? "Mock Exam" : "Practice"} &middot;{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {a.score}/{a.totalQuestions}
                    </div>
                    <div className={`text-xs font-medium ${
                      (a.score / a.totalQuestions) >= 0.7 ? "text-green-600" : (a.score / a.totalQuestions) >= 0.5 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {Math.round((a.score / a.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
