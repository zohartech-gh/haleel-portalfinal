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

const SUBJECT_COLORS: Record<string, string> = {
  "Mathematics": "from-blue-500 to-blue-700",
  "Core Mathematics": "from-blue-500 to-blue-700",
  "English Language": "from-purple-500 to-purple-700",
  "Integrated Science": "from-emerald-500 to-emerald-700",
  "Social Studies": "from-amber-500 to-amber-700",
  "ICT": "from-cyan-500 to-cyan-700",
  "RME": "from-rose-500 to-rose-700",
  "French": "from-indigo-500 to-indigo-700",
  "Creative Arts": "from-pink-500 to-pink-700",
  "Career Technology": "from-teal-500 to-teal-700",
  "Physics": "from-sky-500 to-sky-700",
  "Chemistry": "from-orange-500 to-orange-700",
  "Biology": "from-green-500 to-green-700",
  "Economics": "from-violet-500 to-violet-700",
  "Geography": "from-teal-500 to-teal-700",
  "Government": "from-red-500 to-red-700",
  "Literature": "from-fuchsia-500 to-fuchsia-700",
  "Elective Mathematics": "from-indigo-500 to-indigo-700",
  "Accounting": "from-yellow-500 to-yellow-700",
};

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" /><span className="text-gray-500">Loading...</span></div></div>;
  if (!user) return null;

  const isJHS = level === "jhs";
  const core = subjects.filter((s) => s.category === "CORE");
  const elective = subjects.filter((s) => s.category === "ELECTIVE");

  function SubjectCard({ s }: { s: Subject }) {
    const color = SUBJECT_COLORS[s.name] || "from-gray-500 to-gray-700";
    return (
      <Link
        href={`/${level}/practice?subject=${encodeURIComponent(s.name)}`}
        className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
            {getInitials(s.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 group-hover:text-gray-900 truncate">{s.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{s._count.questions} questions</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                s._count.questions > 0 ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
              }`}>
                {s._count.questions > 0 ? "Ready" : "Coming soon"}
              </span>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{isJHS ? "JHS" : "SHS"} Subjects</h1>
          <p className="text-gray-500 mt-1">Select a subject to start practicing</p>
        </div>

        {isJHS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => <SubjectCard key={s.id} s={s} />)}
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Core Subjects</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{core.length} subjects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {core.map((s) => <SubjectCard key={s.id} s={s} />)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Elective Subjects</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{elective.length} subjects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {elective.map((s) => <SubjectCard key={s.id} s={s} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
