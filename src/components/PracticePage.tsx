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
  const isJHS = level === "jhs";

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
  const [practiceMode, setPracticeMode] = useState<"random" | "wrong">("random");
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedOption: string; isCorrect: boolean }[]>([]);

  const accentGradient = isJHS ? "from-blue-600 to-blue-800" : "from-emerald-600 to-emerald-800";
  const accentBg = isJHS ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700";
  const accentBgLight = isJHS ? "bg-blue-50" : "bg-emerald-50";
  const accentText = isJHS ? "text-blue-600" : "text-emerald-600";
  const accentBorder = isJHS ? "border-blue-500" : "border-emerald-500";
  const accentRing = isJHS ? "focus:ring-blue-500" : "focus:ring-emerald-500";

  useEffect(() => {
    fetch(`/api/subjects?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
  }, [level]);

  useEffect(() => {
    if (subjectParam) setSelectedSubject(subjectParam);
  }, [subjectParam]);

  // Fetch wrong answer count when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetch(`/api/questions/wrong?level=${level.toUpperCase()}&subject=${encodeURIComponent(selectedSubject)}`)
        .then((r) => r.json())
        .then((data) => setWrongCount(data.count || 0))
        .catch(() => setWrongCount(0));
    } else {
      setWrongCount(0);
    }
  }, [selectedSubject, level, started]);

  async function startPractice(mode: "random" | "wrong" = "random") {
    if (!selectedSubject) return;
    setLoading(true);
    setPracticeMode(mode);
    try {
      const url = mode === "wrong"
        ? `/api/questions/wrong?level=${level.toUpperCase()}&subject=${encodeURIComponent(selectedSubject)}&fetch=true`
        : `/api/questions?level=${level.toUpperCase()}&subject=${encodeURIComponent(selectedSubject)}&mode=practice`;
      const res = await fetch(url);
      const data = await res.json();
      const qs = mode === "wrong" ? data.questions || data : data;
      setQuestions(qs);
      setCurrentIdx(0);
      setScore(0);
      setAnswered(0);
      setSelected(null);
      setShowResult(false);
      setAnswers([]);
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
    const isCorrect = option === questions[currentIdx].correctOption;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setAnswers((prev) => [...prev, {
      questionId: questions[currentIdx].id,
      selectedOption: option,
      isCorrect,
    }]);
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
        answers,
      }),
    });
    setStarted(false);
  }

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" /><span className="text-gray-500">Loading...</span></div></div>;
  if (!user) return null;

  const q = questions[currentIdx];
  const isFinished = started && currentIdx >= questions.length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Practice Mode</h1>
          <p className="text-gray-500 mt-1">Answer questions and get instant feedback</p>
        </div>

        {!started ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">Select a Subject</h2>
                <p className="text-sm text-gray-400">Choose a subject to practice past questions</p>
              </div>
            </div>
            <select
              className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-5 text-gray-700 font-medium focus:outline-none focus:ring-2 ${accentRing} focus:border-transparent transition-all`}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => startPractice("random")}
              disabled={!selectedSubject || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-40 shadow-lg ${accentBg}`}
            >
              {loading && practiceMode === "random" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading questions...
                </span>
              ) : "Start Practice"}
            </button>

            {wrongCount > 0 && (
              <button
                onClick={() => startPractice("wrong")}
                disabled={!selectedSubject || loading}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-40 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mt-3"
              >
                {loading && practiceMode === "wrong" ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                    </svg>
                    Review Wrong Answers ({wrongCount})
                  </span>
                )}
              </button>
            )}
          </div>
        ) : isFinished ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Score banner */}
            <div className={`bg-gradient-to-r ${accentGradient} p-8 text-center text-white`}>
              <div className="text-6xl font-extrabold mb-2">{pct}%</div>
              <div className="text-white/70 text-lg">{score} out of {questions.length} correct</div>
              <div className="mt-3 text-sm font-medium text-white/50">{selectedSubject}</div>
            </div>
            <div className="p-6 flex gap-3 justify-center">
              <button onClick={() => { setStarted(false); setSelectedSubject(""); }} className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                New Practice
              </button>
              <button onClick={finishPractice} className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg ${accentBg}`}>
                Save & Exit
              </button>
            </div>
          </div>
        ) : q ? (
          <div className="space-y-4">
            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-600">Question {currentIdx + 1} of {questions.length}</span>
                <span className={`font-bold ${accentText}`}>Score: {score}/{answered}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${isJHS ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`}
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${accentBgLight} ${accentText}`}>{q.topic}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{q.year}</span>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">{q.questionText}</p>

              <div className="space-y-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const val = q[`option${opt}` as keyof Question] as string;
                  const isCorrect = opt === q.correctOption;
                  const isSelected = selected === opt;
                  let cls = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                  if (showResult) {
                    if (isCorrect) cls = "border-green-500 bg-green-50 ring-1 ring-green-500/20";
                    else if (isSelected) cls = "border-red-500 bg-red-50 ring-1 ring-red-500/20";
                    else cls = "border-gray-100 opacity-60";
                  } else if (isSelected) {
                    cls = `${accentBorder} ${accentBgLight} ring-1 ${isJHS ? "ring-blue-500/20" : "ring-emerald-500/20"}`;
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${cls}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          showResult && isCorrect ? "bg-green-500 text-white" :
                          showResult && isSelected ? "bg-red-500 text-white" :
                          isSelected ? `${isJHS ? "bg-blue-600" : "bg-emerald-600"} text-white` :
                          "bg-gray-100 text-gray-500"
                        }`}>{opt}</span>
                        <span className="font-medium text-gray-700">{val}</span>
                        {showResult && isCorrect && (
                          <svg className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`mt-5 p-4 rounded-xl border ${selected === q.correctOption ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`font-bold text-sm ${selected === q.correctOption ? "text-green-700" : "text-red-700"}`}>
                    {selected === q.correctOption ? "Correct! Well done!" : `Incorrect. The answer is ${q.correctOption}.`}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {showResult && (
                <div className="mt-5 flex justify-end">
                  <button onClick={nextQuestion} className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md ${accentBg} flex items-center gap-2`}>
                    {currentIdx < questions.length - 1 ? "Next Question" : "See Results"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No questions available for this subject yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon or try another subject.</p>
            <button onClick={() => setStarted(false)} className={`mt-5 px-6 py-2.5 rounded-xl font-bold text-white ${accentBg}`}>Go Back</button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

export default function PracticePage(props: PracticePageProps) {
  return <Suspense><PracticeContent {...props} /></Suspense>;
}
