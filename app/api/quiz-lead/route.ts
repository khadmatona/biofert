/**
 * Receives the quiz's user-info + one structured field per questionnaire
 * answer + recommended product once the assessment finishes, and forwards
 * it as one row to a Google Sheet via an Apps Script Web App
 * (GOOGLE_SHEETS_WEBHOOK_URL) — see .env.local.example for setup steps and
 * the exact column order the Apps Script expects. No auth, no Shopify
 * order/customer involved; this is a lead-capture side effect only, so a
 * failure here must never surface as an error to the quiz UI.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface QuizLeadPayload {
  session_id: string;
  full_name: string;
  phone: string;
  email: string;
  age: string;
  fertility_issue: string;
  trying_duration: string;
  previous_pregnancy: string;
  woman_situation: string;
  man_situation: string;
  tests_diagnosis: string;
  main_goal: string;
  recommended_product_name: string;
}

const REQUIRED_STRING_FIELDS: (keyof QuizLeadPayload)[] = [
  "session_id",
  "full_name",
  "phone",
  "email",
  "age",
  "fertility_issue",
  "trying_duration",
  "previous_pregnancy",
  "woman_situation",
  "man_situation",
  "tests_diagnosis",
  "main_goal",
  "recommended_product_name",
];

function isValidPayload(body: unknown): body is QuizLeadPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return REQUIRED_STRING_FIELDS.every((field) => typeof b[field] === "string");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[quiz-lead] GOOGLE_SHEETS_WEBHOOK_URL is not configured");
    return NextResponse.json({ ok: false }, { status: 202 });
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        created_at: new Date().toISOString(),
        ...body,
      }),
    });
  } catch (error) {
    console.error("[quiz-lead] failed to forward to Google Sheets webhook", error);
  }

  return NextResponse.json({ ok: true });
}
