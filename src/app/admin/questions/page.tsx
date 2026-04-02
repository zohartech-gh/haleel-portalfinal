"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  level: string;
  examType: string;
  subject: { name: string };
  topic: string;
  year: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  difficulty: string;
}

interface Subject {
  id: string;
  name: string;
  level: string;
}

const emptyForm = {
  level: "JHS",
  subjectId: "",
  topic: "",
  year: 2023,
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  explanation: "",
  difficulty: "MEDIUM",
};

export default function AdminQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [filterLevel, filterSubject]);

  async function loadData() {
    const params = new URLSearchParams();
    if (filterLevel !== "ALL") params.set("level", filterLevel);
    if (filterSubject !== "ALL") params.set("subjectId", filterSubject);

    const [qRes, sRes] = await Promise.all([
      fetch(`/api/admin/questions?${params}`),
      fetch("/api/admin/subjects"),
    ]);

    if (qRes.status === 401 || sRes.status === 401) {
      router.push("/admin/login");
      return;
    }

    setQuestions(await qRes.json());
    setSubjects(await sRes.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = editingId ? `/api/admin/questions/${editingId}` : "/api/admin/questions";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...emptyForm });
        loadData();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    loadData();
  }

  function editQuestion(q: Question) {
    setForm({
      level: q.level,
      subjectId: q.subject ? subjects.find((s) => s.name === q.subject.name && s.level === q.level)?.id || "" : "",
      topic: q.topic,
      year: q.year,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation,
      difficulty: q.difficulty,
    });
    setEditingId(q.id);
    setShowForm(true);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const filteredSubjects = subjects.filter(
    (s) => form.level === "ALL" || s.level === form.level
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-lg text-blue-700">Haleel<span className="text-emerald-600">AI</span></span>
            <span className="ml-2 text-xs bg-gray-800 text-white px-2 py-0.5 rounded">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">Log out</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
            className="btn-primary text-sm"
          >
            + Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="ALL">All Levels</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
          </select>
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="ALL">All Subjects</option>
            {subjects.filter((s) => filterLevel === "ALL" || s.level === filterLevel).map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Question</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Level</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value, subjectId: "" })}>
                      <option value="JHS">JHS</option>
                      <option value="SHS">SHS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
                      <option value="">Select...</option>
                      {filteredSubjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <input className="w-full border rounded-lg px-3 py-2" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} required />
                </div>
                {["A", "B", "C", "D"].map((opt) => (
                  <div key={opt}>
                    <label className="block text-sm font-medium mb-1">Option {opt}</label>
                    <input className="w-full border rounded-lg px-3 py-2" value={form[`option${opt}` as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [`option${opt}`]: e.target.value })} required />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">Correct Option</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={form.correctOption} onChange={(e) => setForm({ ...form, correctOption: e.target.value })}>
                    {["A", "B", "C", "D"].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Explanation</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} required />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
                    {loading ? "Saving..." : editingId ? "Update" : "Add Question"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-3">
          {questions.length === 0 ? (
            <div className="card text-center text-gray-400 py-12">No questions found.</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{q.level}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{q.subject.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{q.year}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{q.difficulty}</span>
                    </div>
                    <p className="text-sm font-medium">{q.questionText}</p>
                    <p className="text-xs text-gray-400 mt-1">Answer: {q.correctOption}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => editQuestion(q)} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(q.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
