"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SignupForm() {
  const searchParams = useSearchParams();
  const preselectedLevel = searchParams.get("level") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    level: preselectedLevel === "SHS" ? "SHS" : preselectedLevel === "JHS" ? "JHS" : "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.level) {
      setError("Please select your level (JHS or SHS).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      window.location.href = `/${form.level.toLowerCase()}/dashboard`;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Photo Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800"
          alt="African students in classroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-emerald-900/30" />
        <div className="relative z-10 text-center max-w-md mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.svg" alt="HaleelAI" className="h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Join HaleelAI today</h2>
          <p className="text-emerald-100/80 leading-relaxed">
            Start practicing BECE & WASSCE past questions with AI-powered tools. Completely free.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6 max-w-xs mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-white">10K+</div>
              <div className="text-xs text-white/60 mt-1">Questions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-white">AI</div>
              <div className="text-xs text-white/60 mt-1">Powered</div>
            </div>
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left">
            <p className="text-white/90 text-sm italic leading-relaxed">
              &ldquo;I went from struggling with Science to topping my class. HaleelAI made studying feel like a game, and the results speak for themselves.&rdquo;
            </p>
            <p className="text-white/60 text-xs mt-3 font-medium">— Kwame O., JHS Student</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/logo.svg" alt="HaleelAI" className="h-10" />
              <span className="text-xl font-bold text-gray-900">
                HaleelAI
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-gray-400 mt-1">Start practicing today - it&apos;s free</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3.5 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-700"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-700"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-700"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Level</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, level: "JHS" })}
                  className={`py-4 rounded-xl font-bold border-2 transition-all ${
                    form.level === "JHS"
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg">JHS</div>
                  <div className="text-xs font-medium mt-0.5 opacity-70">BECE</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, level: "SHS" })}
                  className={`py-4 rounded-xl font-bold border-2 transition-all ${
                    form.level === "SHS"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg">SHS</div>
                  <div className="text-xs font-medium mt-0.5 opacity-70">WASSCE</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Log in
            </Link>
          </p>

          <p className="text-center text-xs text-gray-300 mt-4">
            haleelai.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
