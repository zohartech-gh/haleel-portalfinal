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

  const MOCK_TIME = 30 * 60; // 30 minutes

  useEffect(() => {
    fetch(`/api/subjects?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
  }, [level]);

  // Timer
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

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user) return null;

  const q = questions[currentIdx];

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mock {isJHS ? "BECE" : "WASSCE"}</h1>

        {!started ? (
          <div className="card">
            <h2 className="font-semibold mb-2">Take a Mock Exam</h2>
            <p className="text-sm text-gray-500 mb-4">Timed exam with {MOCK_TIME / 60} minutes. All questions must be answered before submitting.</p>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button onClick={startMock} disabled={!selectedSubject || loading} className="btn-primary disabled:opacity-50">
              {loading ? "Loading..." : "Start Mock Exam"}
            </button>
          </div>
        ) : submitted ? (
          <div className="card text-center">
            <h2 className="text-xl font-bold mb-2">Mock Exam Complete!</h2>
            <p className="text-gray-500 mb-4">{selectedSubject}</p>
            <div className="text-4xl font-bold mb-2 text-blue-700">{score}/{questions.length}</div>
            <p className="text-gray-500 mb-2">{Math.round((score / questions.length) * 100)}%</p>
            <p className="text-sm text-gray-400 mb-6">Time spent: {formatTime(MOCK_TIME - timeLeft)}</p>

            {/* Review */}
            <div className="text-left space-y-4 mt-6">
              {questions.map((q, i) => (
                <div key={q.id} className={`p-4 rounded-lg border ${answers[i] === q.correctOption ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <p className="font-medium text-sm mb-2">{i + 1}. {q.questionText}</p>
                  <p className="text-xs text-gray-500">Your answer: {answers[i] || "Not answered"} | Correct: {q.correctOption}</p>
                  <p className="text-xs text-gray-600 mt-1">{q.explanation}</p>
                </div>
              ))}
            </div>

            <button onClick={() => { setStarted(false); setSelectedSubject(""); }} className="btn-primary mt-6">New Mock Exam</button>
          </div>
        ) : q ? (
          <div>
            {/* Timer & Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Question {currentIdx + 1} of {questions.length}</span>
              <span className={`font-mono font-bold ${timeLeft < 300 ? "text-red-600" : "text-gray-700"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className={`h-2 rounded-full transition-all ${isJHS ? "bg-blue-600" : "bg-emerald-600"}`} style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="card">
              <p className="text-lg font-medium mb-6">{q.questionText}</p>
              <div className="space-y-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const val = q[`option${opt}` as keyof Question] as string;
                  const isSelected = answers[currentIdx] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [currentIdx]: opt })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? isJHS ? "border-blue-500 bg-blue-50" : "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-semibold mr-2">{opt}.</span>
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-30"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {currentIdx < questions.length - 1 ? (
                    <button onClick={() => setCurrentIdx((i) => i + 1)} className="btn-primary text-sm">
                      Next
                    </button>
                  ) : (
                    <button onClick={handleSubmit} className="btn-secondary text-sm">
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question navigator */}
            <div className="mt-4 flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-8 h-8 text-xs rounded font-medium ${
                    i === currentIdx
                      ? "bg-blue-600 text-white"
                      : answers[i]
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-gray-500">No questions available for this subject yet.</p>
            <button onClick={() => setStarted(false)} className="btn-primary mt-4">Go Back</button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
