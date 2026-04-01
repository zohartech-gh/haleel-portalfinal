"use client";

import { useEffect, useState } from "react";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface MockPageProps {
  level: "jhs" | "shs";
}

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  topic: string;
  year: number;
}

interface Subject {
  id: string;
  name: string;
}

export default function MockPage({ level }: MockPageProps) {
  const { user, loading: userLoading } = useUser();
  const isJHS = level === "jhs";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const MOCK_TIME = 60 * 60; // 60 minutes for 40 questions (WAEC standard pace)

  const accentGradient = isJHS ? "from-blue-600 to-indigo-800" : "from-emerald-600 to-teal-800";
  const accentBg = isJHS ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700";
  const accentBgLight = isJHS ? "bg-blue-50" : "bg-emerald-50";
  const accentText = isJHS ? "text-blue-600" : "text-emerald-600";
  const accentBorder = isJHS ? "border-blue-500" : "border-emerald-500";

  useEffect(() => {
    fetch(`/api/subjects?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
  }, [level]);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  async function startMock() {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?level=${level.toUpperCase()}&subject=${encodeURIComponent(selectedSubject)}&mode=mock`);
      const data = await res.json();
      setQuestions(data);
      setAnswers({});
      setCurrentIdx(0);
      setScore(0);
      setSubmitted(false);
      setTimeLeft(MOCK_TIME);
      setStarted(true);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctOption) s++;
    });
    setScore(s);
    setSubmitted(true);

    fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: selectedSubject,
        mode: "MOCK",
        score: s,
        totalQuestions: questions.length,
        timeSpent: MOCK_TIME - timeLeft,
        level: level.toUpperCase(),
      }),
    }).catch(() => {});
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" /><span className="text-gray-500">Loading...</span></div></div>;
  if (!user) return null;

  const q = questions[currentIdx];
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Mock {isJHS ? "BECE" : "WASSCE"}</h1>
          <p className="text-gray-500 mt-1">Timed exam simulation</p>
        </div>

        {!started ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">Take a Mock Exam</h2>
                <p className="text-sm text-gray-400">{MOCK_TIME / 60} minutes timed. Simulates real exam conditions.</p>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-amber-700">{MOCK_TIME / 60}m</div>
                <div className="text-xs text-amber-600">Time Limit</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-blue-700">MCQ</div>
                <div className="text-xs text-blue-600">Question Type</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-emerald-700">Auto</div>
                <div className="text-xs text-emerald-600">Graded</div>
              </div>
            </div>

            <select
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-5 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button onClick={startMock} disabled={!selectedSubject || loading} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-40 shadow-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : "Start Mock Exam"}
            </button>
          </div>
        ) : submitted ? (
          <div className="space-y-6">
            {/* Score banner */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r ${accentGradient} p-8 text-center text-white`}>
                <div className="text-6xl font-extrabold mb-2">{pct}%</div>
                <div className="text-white/70 text-lg">{score} out of {questions.length} correct</div>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-white/50">
                  <span>{selectedSubject}</span>
                  <span>Time: {formatTime(MOCK_TIME - timeLeft)}</span>
                </div>
              </div>
              <div className="p-6 flex justify-center">
                <button onClick={() => { setStarted(false); setSelectedSubject(""); }} className={`px-8 py-3 rounded-xl font-bold text-white shadow-md ${accentBg}`}>
                  New Mock Exam
                </button>
              </div>
            </div>

            {/* Review */}
            <h3 className="font-bold text-gray-800">Review Answers</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const correct = answers[i] === q.correctOption;
                return (
                  <div key={q.id} className={`bg-white rounded-xl p-5 border-2 ${correct ? "border-green-200" : "border-red-200"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${correct ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{q.questionText}</p>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className={correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            Your answer: {answers[i] || "Skipped"}
                          </span>
                          {!correct && <span className="text-green-600 font-semibold">Correct: {q.correctOption}</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : q ? (
          <div className="space-y-4">
            {/* Timer bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Question {currentIdx + 1} of {questions.length}</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-sm ${timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-100 text-gray-700"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${isJHS ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`} style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-2">{answeredCount} of {questions.length} answered</div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <p className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">{q.questionText}</p>
              <div className="space-y-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const val = q[`option${opt}` as keyof Question] as string;
                  const isSelected = answers[currentIdx] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [currentIdx]: opt })}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${accentBorder} ${accentBgLight} ring-1 ${isJHS ? "ring-blue-500/20" : "ring-emerald-500/20"}`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          isSelected ? `${isJHS ? "bg-blue-600" : "bg-emerald-600"} text-white` : "bg-gray-100 text-gray-500"
                        }`}>{opt}</span>
                        <span className="font-medium text-gray-700">{val}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="px-5 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Previous
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button onClick={() => setCurrentIdx((i) => i + 1)} className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md ${accentBg} flex items-center gap-1`}>
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md flex items-center gap-1">
                    Submit Exam
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Question navigator */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs font-medium text-gray-400 mb-3">QUESTION NAVIGATOR</div>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-9 h-9 text-xs rounded-lg font-bold transition-all ${
                      i === currentIdx
                        ? `${isJHS ? "bg-blue-600" : "bg-emerald-600"} text-white shadow-md`
                        : answers[i]
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500 font-medium">No questions available for this subject yet.</p>
            <button onClick={() => setStarted(false)} className={`mt-5 px-6 py-2.5 rounded-xl font-bold text-white ${accentBg}`}>Go Back</button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
