import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateWithGemini } from "@/lib/gemini";

export default async function StatusPage() {
  let backend = true;

  let database: boolean;
  let dbError: string | null = null;
  try {
    const supabase = createClient();
    const { error } = await supabase.from("workflows").select("id").limit(1);
    database = !error;
    if (error) dbError = error.message;
  } catch (e) {
    database = false;
    dbError = e instanceof Error ? e.message : "Connection failed";
  }

  let gemini: boolean;
  let geminiError: string | null = null;
  try {
    await generateWithGemini("Reply with exactly: OK");
    gemini = true;
  } catch (e) {
    gemini = false;
    geminiError = e instanceof Error ? e.message : "API failed";
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link href="/" className="text-slate-600 hover:text-slate-800">
            ← Home
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Status</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-4">
            Service health
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
              <span className="font-medium text-slate-800">Backend</span>
              <span className={backend ? "text-emerald-600" : "text-red-600"}>
                {backend ? "✅" : "❌"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
              <span className="font-medium text-slate-800">Database</span>
              <span className={database ? "text-emerald-600" : "text-red-600"}>
                {database ? "✅" : "❌"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
              <span className="font-medium text-slate-800">Gemini</span>
              <span className={gemini ? "text-emerald-600" : "text-red-600"}>
                {gemini ? "✅" : "❌"}
              </span>
            </li>
          </ul>
          {(!database || !gemini) && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {!database && <p>Database: {dbError ?? "Unavailable"}</p>}
              {!gemini && <p>Gemini: {geminiError ?? "Unavailable"}</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
