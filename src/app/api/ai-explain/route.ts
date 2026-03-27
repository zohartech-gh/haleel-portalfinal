import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSession } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { question, selectedOption, correctOption, subject, topic, level } =
    await req.json();

  if (!question || !correctOption || !subject) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400 }
    );
  }

  const examType = level?.toUpperCase() === "JHS" ? "BECE" : "WASSCE";

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    prompt: `You are a friendly, encouraging tutor helping a Ghanaian ${level?.toUpperCase() || "SHS"} student prepare for ${examType}.

The student answered a question incorrectly. Help them understand the correct answer.

Subject: ${subject}
Topic: ${topic || "General"}

Question: ${question}
Student's answer: ${selectedOption}
Correct answer: ${correctOption}

Provide a clear, step-by-step explanation of:
1. Why the correct answer (${correctOption}) is right
2. Why the student's answer (${selectedOption}) is wrong
3. A tip or memory aid to remember this concept

Keep it concise (3-5 short paragraphs), friendly, and encouraging. Use simple language appropriate for ${level?.toUpperCase() || "SHS"} level. Reference Ghanaian examples where helpful.`,
    maxOutputTokens: 800,
  });

  return result.toTextStreamResponse();
}
