"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface PracticePageProps {
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

function PracticeContent({ level }: PracticePageProps) {
  const { user, loading: userLoading } = useUser();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") || "";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(subjectParam);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/subjects?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
  }, [level]);

  useEffect(() => {
    if (subjectParam) setSelectedSubject(subjectParam);
  }, [subjectParam]);

  async function startPractice() {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?level=${level.toUpperCase()}&subject=${encodeURIComponent(selectedSubject)}&mode=practice`);
      const data = await res.json();
      setQuestions(data);
      setCurrentIdx(0);
      setScore(0);
      setAnswered(0);
      setSelected(null);
      setShowResult(false);
      setStarted(true);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(option: string) {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    setAnswered((a) => a + 1);
    if (option === questions[currentIdx].correctOption) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx((i) => i + 1);
  }

  async function finishPractice() {
    await fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: selectedSubject,
        mode: "PRACTICE",
        score,
        totalQuestions: questions.length,
        timeSpent: 0,
        level: level.toUpperCase(),
      }),
    });
    setStarted(false);
  }

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user) return null;

  const q = questions[currentIdx];
  const isFinished = started && currentIdx >= questions.length;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Practice Mode</h1>

        {!started ? (
          <div className="card">
            <h2 className="font-semibold mb-4">Select a subject to practice</h2>
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
            <button onClick={startPractice} disabled={!selectedSubject || loading} className="btn-primary disabled:opacity-50">
              {loading ? "Loading questions..." : "Start Practice"}
            </button>
          </div>
        ) : isFinished ? (
          <div className="card text-center">
            <h2 className="text-xl font-bold mb-2">Practice Complete!</h2>
            <p className="text-gray-500 mb-4">{selectedSubject}</p>
            <div className="text-4xl font-bold mb-2 text-blue-700">
              {score}/{questions.length}
            </div>
            <p className="text-gray-500 mb-6">
              {Math.round((score / questions.length) * 100)}% correct
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setStarted(false); setSelectedSubject(""); }} className="btn-secondary">
                New Practice
              </button>
              <button onClick={finishPractice} className="btn-primary">
                Save & Exit
              </button>
            </div>
          </div>
        ) : q ? (
          <div>
            {/* Progress bar */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>Score: {score}/{answered}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="card">
              <div className="text-xs text-gray-400 mb-2">{q.topic} &middot; {q.year}</div>
              <p className="text-lg font-medium mb-6">{q.questionText}</p>

              <div className="space-y-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const val = q[`option${opt}` as keyof Question] as string;
                  const isCorrect = opt === q.correctOption;
                  const isSelected = selected === opt;
                  let cls = "border-gray-200 hover:border-gray-300";
                  if (showResult) {
                    if (isCorrect) cls = "border-green-500 bg-green-50";
                    else if (isSelected) cls = "border-red-500 bg-red-50";
                  } else if (isSelected) {
                    cls = "border-blue-500 bg-blue-50";
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${cls}`}
                    >
                      <span className="font-semibold mr-2">{opt}.</span>
                      {val}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className={`font-semibold ${selected === q.correctOption ? "text-green-600" : "text-red-600"}`}>
                    {selected === q.correctOption ? "Correct!" : `Incorrect. The answer is ${q.correctOption}.`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
                </div>
              )}

              {showResult && (
                <div className="mt-4 flex justify-end">
                  {currentIdx < questions.length - 1 ? (
                    <button onClick={nextQuestion} className="btn-primary">Next Question</button>
                  ) : (
                    <button onClick={nextQuestion} className="btn-primary">See Results</button>
                  )}
                </div>
              )}
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

export default function PracticePage(props: PracticePageProps) {
  return <Suspense><PracticeContent {...props} /></Suspense>;
}
