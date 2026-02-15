import { createClient } from "@/lib/supabase/server";
import { generateWithGemini } from "@/lib/gemini";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET() {
  const backend = true;

  let database: boolean;
  try {
    const supabase = createClient();
    const { error } = await supabase.from("workflows").select("id").limit(1);
    database = !error;
  } catch {
    database = false;
  }

  let gemini: boolean;
  try {
    await generateWithGemini("Reply with exactly: OK");
    gemini = true;
  } catch {
    gemini = false;
  }

  return NextResponse.json({
    backend,
    database,
    gemini,
  });
}
