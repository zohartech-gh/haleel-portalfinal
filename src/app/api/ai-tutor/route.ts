import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSession } from "@/lib/auth";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, subject, level } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const examType = level?.toUpperCase() === "SHS" ? "WASSCE" : "BECE";
  const levelName = level?.toUpperCase() === "SHS" ? "Senior High School" : "Junior High School";

  const systemPrompt = `You are HaleelAI Tutor, a friendly, patient, and knowledgeable teacher for Ghanaian ${levelName} students preparing for the ${examType} examination.

YOUR ROLE:
- You teach students any subject they ask about${subject ? `, currently focused on "${subject}"` : ""}
- You explain concepts clearly using simple language appropriate for ${levelName} students
- You use Ghanaian context and examples when relevant (Ghanaian rivers, cities, currency, history, culture)
- You follow the official WAEC ${examType} syllabus

TEACHING STYLE:
- Break complex topics into simple, digestible parts
- Use analogies and real-world examples students can relate to
- Give step-by-step explanations for math and science problems
- Use bullet points and numbered lists for clarity
- Ask the student questions to check understanding
- Encourage students and celebrate their effort
- When solving math problems, show each step clearly

RULES:
- Keep responses focused on education and academics
- If a student asks something off-topic, gently guide them back to studying
- Always be encouraging and supportive
- If you don't know something, say so honestly
- Use simple English appropriate for Ghanaian students
- When relevant, mention how a topic might appear in the ${examType} exam

FORMATTING:
- Use **bold** for key terms and definitions
- Use numbered lists for steps
- Use bullet points for lists of items
- Keep paragraphs short (2-3 sentences max)
- Use examples after explaining concepts`;

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 1500,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
