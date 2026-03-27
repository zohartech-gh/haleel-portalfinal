import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSession } from "@/lib/auth";
import { getTopicsForSubject } from "@/lib/waec-syllabus";

export const maxDuration = 60;

interface GeneratedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { level, subject, topic, count = 5, difficulty = "medium" } = body;

  if (!level || !subject || !topic) {
    return NextResponse.json(
      { error: "level, subject, and topic are required" },
      { status: 400 }
    );
  }

  const validTopics = getTopicsForSubject(level.toUpperCase(), subject);
  if (validTopics.length === 0) {
    return NextResponse.json(
      { error: "Invalid subject for this level" },
      { status: 400 }
    );
  }

  const examType = level.toUpperCase() === "JHS" ? "BECE" : "WASSCE";
  const questionCount = Math.min(Math.max(1, count), 10);

  const prompt = `You are an expert examiner for Ghana's ${examType} examination (West African Examinations Council - WAEC).

Generate exactly ${questionCount} multiple-choice questions for the subject "${subject}", topic "${topic}".

Level: ${level.toUpperCase()} (${examType})
Difficulty: ${difficulty}

IMPORTANT RULES:
- Questions MUST follow the official WAEC ${examType} syllabus for "${subject}"
- Questions must be appropriate for Ghanaian ${level.toUpperCase()} students
- Each question must have exactly 4 options (A, B, C, D) with ONE correct answer
- Provide a clear, educational explanation for each correct answer
- Use Ghanaian context where appropriate (e.g., Ghanaian rivers, cities, currency, history)
- Vary question difficulty within the "${difficulty}" range
- Questions should test understanding, not just memorisation

Respond with ONLY a valid JSON array. No markdown, no code fences, no extra text.
Each object in the array must have these exact fields:
{
  "questionText": "the question",
  "optionA": "first option",
  "optionB": "second option",
  "optionC": "third option",
  "optionD": "fourth option",
  "correctOption": "A or B or C or D",
  "explanation": "why the correct answer is right, with educational context"
}`;

  try {
    const result = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      prompt,
      maxOutputTokens: 4000,
      temperature: 0.7,
    });

    let text = result.text.trim();
    // Strip markdown code fences if present
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const questions: GeneratedQuestion[] = JSON.parse(text);

    // Validate structure
    const validated = questions
      .filter(
        (q) =>
          q.questionText &&
          q.optionA &&
          q.optionB &&
          q.optionC &&
          q.optionD &&
          ["A", "B", "C", "D"].includes(q.correctOption) &&
          q.explanation
      )
      .slice(0, questionCount);

    if (validated.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate valid questions. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      questions: validated,
      meta: { level, subject, topic, difficulty, examType },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}
