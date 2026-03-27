"use client";

import { useState, useEffect, useRef } from "react";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface AIPracticePageProps {
  level: "jhs" | "shs";
}

interface SyllabusTopic {
  subject: string;
  topics: string[];
}

interface AIQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
}

type Phase = "select" | "loading" | "quiz" | "results";

export default function AIPracticePage({ level }: AIPracticePageProps) {
  const { user, loading: userLoading } = useUser();
  const isJHS = level === "jhs";
  const accent = isJHS ? "blue" : "emerald";

  // Syllabus state
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  // Quiz state
  const [phase, setPhase] = useState<Phase>("select");
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [answers, setAnswers] = useState<
    { question: AIQuestion; selected: string; correct: boolean }[]
  >([]);
  const [error, setError] = useState("");

  // AI explanation state
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const explanationRef = useRef<HTMLDivElement>(null);

  // Load syllabus
  useEffect(() => {
    fetch(`/api/syllabus?level=${level.toUpperCase()}`)
      .then((r) => r.json())
      .then((data) => setSyllabus(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [level]);

  // Update topics when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const entry = syllabus.find((s) => s.subject === selectedSubject);
      setTopics(entry?.topics ?? []);
      setSelectedTopic("");
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedSubject, syllabus]);

  async function generateQuestions() {
    if (!selectedSubject || !selectedTopic) return;
    setPhase("loading");
    setError("");

    try {
      const res = await fetch("/api/ai-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: level.toUpperCase(),
          subject: selectedSubject,
          topic: selectedTopic,
          count: questionCount,
          difficulty,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate questions");
      }

      const data = await res.json();
      setQuestions(data.questions);
      setCurrentIdx(0);
      setScore(0);
      setAnswered(0);
      setSelected(null);
      setShowResult(false);
      setAnswers([]);
      setAiExplanation("");
      setPhase("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("select");
    }
  }

  function handleAnswer(option: string) {
    if (showResult) return;
    const q = questions[currentIdx];
    const correct = option === q.correctOption;
    setSelected(option);
    setShowResult(true);
    setAnswered((a) => a + 1);
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { question: q, selected: option, correct }]);
    setAiExplanation("");
  }

  async function getAIExplanation() {
    const q = questions[currentIdx];
    if (!q || !selected) return;
    setLoadingExplanation(true);
    setAiExplanation("");

    try {
      const res = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.questionText,
          selectedOption: selected,
          correctOption: q.correctOption,
          subject: selectedSubject,
          topic: selectedTopic,
          level: level.toUpperCase(),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setAiExplanation(fullText);
      }
    } catch {
      setAiExplanation("Could not load AI explanation. Please try again.");
    } finally {
      setLoadingExplanation(false);
    }
  }

  function nextQuestion() {
    setSelected(null);
    setShowResult(false);
    setAiExplanation("");
    if (currentIdx >= questions.length - 1) {
      saveAttempt();
      setPhase("results");
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  async function saveAttempt() {
    try {
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
    } catch {
      // silent fail
    }
  }

  function resetQuiz() {
    setPhase("select");
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
    setAiExplanation("");
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }
  if (!user) return null;

  const q = questions[currentIdx];

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">AI Practice</h1>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              isJHS
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            WAEC Syllabus
          </span>
        </div>

        {/* PHASE: SELECT */}
        {phase === "select" && (
          <div className="card">
            <h2 className="font-semibold mb-1">
              Generate AI Questions from WAEC{" "}
              {isJHS ? "BECE" : "WASSCE"} Syllabus
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select a subject and topic. AI will generate fresh exam-style
              questions tailored to the official syllabus.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Subject */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose subject...</option>
              {syllabus.map((s) => (
                <option key={s.subject} value={s.subject}>
                  {s.subject}
                </option>
              ))}
            </select>

            {/* Topic */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">Choose topic...</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <div className="flex gap-2 mb-4">
              {["easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors capitalize ${
                    difficulty === d
                      ? d === "easy"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : d === "medium"
                        ? `border-${accent}-500 bg-${accent}-50 text-${accent}-700`
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Count */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <div className="flex gap-2 mb-6">
              {[3, 5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    questionCount === n
                      ? isJHS
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={generateQuestions}
              disabled={!selectedSubject || !selectedTopic}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 ${
                isJHS
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Generate Questions with AI
            </button>
          </div>
        )}

        {/* PHASE: LOADING */}
        {phase === "loading" && (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-4" />
            <p className="text-gray-600 font-medium">
              AI is generating {questionCount} questions...
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedSubject} - {selectedTopic}
            </p>
          </div>
        )}

        {/* PHASE: QUIZ */}
        {phase === "quiz" && q && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span>
                Score: {score}/{answered}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  isJHS ? "bg-blue-600" : "bg-emerald-600"
                }`}
                style={{
                  width: `${((currentIdx + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mb-4">
              {selectedSubject} &middot; {selectedTopic} &middot;{" "}
              <span className="capitalize">{difficulty}</span>
            </div>

            <div className="card">
              <p className="text-lg font-medium mb-6">{q.questionText}</p>

              <div className="space-y-3">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const val = q[`option${opt}` as keyof AIQuestion] as string;
                  const isCorrect = opt === q.correctOption;
                  const isSelected = selected === opt;
                  let cls = "border-gray-200 hover:border-gray-300";
                  if (showResult) {
                    if (isCorrect) cls = "border-green-500 bg-green-50";
                    else if (isSelected) cls = "border-red-500 bg-red-50";
                  } else if (isSelected) {
                    cls = isJHS
                      ? "border-blue-500 bg-blue-50"
                      : "border-emerald-500 bg-emerald-50";
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

              {/* Feedback */}
              {showResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p
                    className={`font-semibold ${
                      selected === q.correctOption
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selected === q.correctOption
                      ? "Correct!"
                      : `Incorrect. The answer is ${q.correctOption}.`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>

                  {/* AI Explain button - only show if wrong */}
                  {selected !== q.correctOption && (
                    <div className="mt-3" ref={explanationRef}>
                      {!aiExplanation && !loadingExplanation && (
                        <button
                          onClick={getAIExplanation}
                          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                            isJHS
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          Ask AI Tutor to Explain
                        </button>
                      )}
                      {loadingExplanation && !aiExplanation && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
                          AI tutor is thinking...
                        </div>
                      )}
                      {aiExplanation && (
                        <div className="mt-2 p-3 bg-white border border-blue-100 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              AI Tutor
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {aiExplanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              {showResult && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                      isJHS
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {currentIdx < questions.length - 1
                      ? "Next Question"
                      : "See Results"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHASE: RESULTS */}
        {phase === "results" && (
          <div>
            <div className="card text-center mb-6">
              <h2 className="text-xl font-bold mb-1">AI Practice Complete!</h2>
              <p className="text-gray-500 mb-4">
                {selectedSubject} - {selectedTopic}
              </p>
              <div
                className={`text-5xl font-bold mb-2 ${
                  isJHS ? "text-blue-700" : "text-emerald-700"
                }`}
              >
                {score}/{questions.length}
              </div>
              <p className="text-gray-500 mb-2">
                {Math.round((score / questions.length) * 100)}% correct
              </p>
              <p className="text-sm text-gray-400 capitalize">
                Difficulty: {difficulty}
              </p>
            </div>

            {/* Answer Review */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-700">Review Answers</h3>
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border-2 ${
                    a.correct
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`text-sm font-bold mt-0.5 ${
                        a.correct ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {a.correct ? "CORRECT" : "WRONG"}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {i + 1}. {a.question.questionText}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Your answer: {a.selected} | Correct:{" "}
                        {a.question.correctOption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                New Topic
              </button>
              <button
                onClick={() => {
                  setPhase("loading");
                  setAnswers([]);
                  generateQuestions();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isJHS
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                Retry Same Topic
              </button>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
