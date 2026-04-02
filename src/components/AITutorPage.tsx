"use client";

import { useState, useRef, useEffect } from "react";
import PortalLayout from "./PortalLayout";
import { useUser } from "@/hooks/useUser";

interface AITutorPageProps {
  level: "jhs" | "shs";
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const JHS_SUBJECTS = ["Mathematics", "Science", "English Language", "Social Studies", "ICT", "RME"];
const SHS_SUBJECTS = ["Core Mathematics", "Elective Mathematics", "Physics", "Chemistry", "Biology", "English Language", "Integrated Science", "Economics", "Social Studies", "Government", "Geography"];

export default function AITutorPage({ level }: AITutorPageProps) {
  const { user, loading: userLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isJHS = level === "jhs";
  const subjects = isJHS ? JHS_SUBJECTS : SHS_SUBJECTS;
  const accentGradient = isJHS ? "from-blue-600 to-blue-800" : "from-emerald-600 to-emerald-800";
  const accentBg = isJHS ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700";
  const accentText = isJHS ? "text-blue-600" : "text-emerald-600";
  const accentBgLight = isJHS ? "bg-blue-50" : "bg-emerald-50";
  const accentBorder = isJHS ? "border-blue-200" : "border-emerald-200";
  const accentRing = isJHS ? "focus:ring-blue-500" : "focus:ring-emerald-500";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startChat() {
    if (!subject) return;
    setStarted(true);
    setMessages([{
      role: "assistant",
      content: `Hello! 👋 I'm your **HaleelAI Tutor** for **${subject}**.\n\nI'm here to help you understand any topic, solve problems, and prepare for your ${isJHS ? "BECE" : "WASSCE"} exam.\n\n**How can I help you today?** You can:\n- Ask me to explain any topic\n- Give me a problem to solve step by step\n- Ask "What topics should I study?"\n- Say "Quiz me on [topic]"\n\nJust type your question below! 📚`,
    }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          subject,
          level: level.toUpperCase(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
        }
      }

      if (!assistantContent) {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function newChat() {
    setMessages([]);
    setStarted(false);
    setSubject("");
    setInput("");
  }

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" /><span className="text-gray-500">Loading...</span></div></div>;
  if (!user) return null;

  return (
    <PortalLayout level={level} userName={user.name}>
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 100px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🤖</span> AI Tutor
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">Your personal teacher — ask anything!</p>
          </div>
          {started && (
            <button onClick={newChat} className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Chat
            </button>
          )}
        </div>

        {!started ? (
          /* Subject Selection */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentGradient} flex items-center justify-center shadow-lg`}>
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">Chat with AI Tutor</h2>
                <p className="text-sm text-gray-400">Choose a subject to start learning</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                    subject === s
                      ? `${accentBorder} ${accentBgLight} ${accentText}`
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={startChat}
              disabled={!subject}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-40 shadow-lg ${accentBg} flex items-center justify-center gap-2`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              Start Learning {subject || "..."}
            </button>

            {/* Quick suggestion cards */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular questions students ask:</p>
              <div className="space-y-2">
                {[
                  "Explain photosynthesis in simple terms",
                  "How do I solve quadratic equations?",
                  "What caused the rise of nationalism in Ghana?",
                  "Help me understand fractions step by step",
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className={`w-1.5 h-1.5 rounded-full ${isJHS ? "bg-blue-400" : "bg-emerald-400"}`} />
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Subject header */}
            <div className={`bg-gradient-to-r ${accentGradient} px-5 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">HaleelAI Tutor</p>
                  <p className="text-white/60 text-xs">{subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/70 text-xs">Online</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ maxHeight: "calc(100vh - 320px)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">🤖</span>
                        <span className="text-xs font-medium text-gray-400">AI Tutor</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? `bg-gradient-to-r ${accentGradient} text-white rounded-br-md`
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.role === "assistant" ? formatMarkdown(msg.content) : msg.content,
                      }}
                    />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">🤖</span>
                      <span className="text-xs font-medium text-gray-400">AI Tutor</span>
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-100 p-3">
              <form onSubmit={sendMessage} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask me anything about ${subject}...`}
                  rows={1}
                  className={`flex-1 resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${accentRing} focus:border-transparent transition-all placeholder-gray-400`}
                  style={{ maxHeight: "120px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 120) + "px";
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-3 rounded-xl text-white transition-all disabled:opacity-40 shadow-md ${accentBg} flex-shrink-0`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2 text-center">AI Tutor follows the official WAEC {isJHS ? "BECE" : "WASSCE"} syllabus</p>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-xs">$1</code>')
    .replace(/\n/g, "<br />");
}
