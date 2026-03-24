"use client";

import Link from "next/link";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

interface SubjectsPageProps {
  level: "jhs" | "shs";
}

interface Subject {
  id: string;
  name: string;
  category: string;
  _count: { questions: number };
}

export default function SubjectsPage({ level }: SubjectsPageProps) {
  const { user, loading } = useUser();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch(`/api/subjects?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then((data) => setSubjects(data))
      .catch(() => {});
  }, [level]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user) return null;

  const isJHS = level === "jhs";
  const core = subjects.filter((s) => s.category === "CORE");
  const elective = subjects.filter((s) => s.category === "ELECTIVE");

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{isJHS ? "JHS" : "SHS"} Subjects</h1>

        {isJHS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <Link
                key={s.id}
                href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                className="card hover:shadow-md hover:border-blue-200 transition-all"
              >
                <h3 className="font-semibold mb-1">{s.name}</h3>
                <p className="text-sm text-gray-400">{s._count.questions} questions available</p>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-3">Core Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {core.map((s) => (
                <Link
                  key={s.id}
                  href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                  className="card hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <h3 className="font-semibold mb-1">{s.name}</h3>
                  <p className="text-sm text-gray-400">{s._count.questions} questions</p>
                </Link>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-3">Elective Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {elective.map((s) => (
                <Link
                  key={s.id}
                  href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
                  className="card hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <h3 className="font-semibold mb-1">{s.name}</h3>
                  <p className="text-sm text-gray-400">{s._count.questions} questions</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
