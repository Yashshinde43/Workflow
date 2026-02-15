import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function RunsPage() {
  const supabase = createClient();
  const { data: runs, error } = await supabase
    .from("runs")
    .select("id, workflow_id, input_text, final_output, created_at, workflows(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-8">
        <p className="text-red-600">Failed to load runs: {error.message}</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link href="/" className="text-slate-600 hover:text-slate-800">
            ← Home
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Run history</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-4">
            Last 5 runs
          </h2>
          {!runs?.length ? (
            <p className="text-slate-600">No runs yet. Create a workflow and run it to see history.</p>
          ) : (
            <ul className="space-y-4">
              {runs.map((run) => {
                const workflowName = (run.workflows as { name?: string } | null)?.name ?? "Workflow";
                return (
                  <li key={run.id}>
                    <Link
                      href={`/runs/${run.id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="font-medium text-slate-800">{workflowName}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {new Date(run.created_at).toLocaleString()}
                      </div>
                      <div className="mt-2 truncate text-sm text-slate-600">
                        Input: {(run.input_text || "").slice(0, 60)}
                        {(run.input_text?.length ?? 0) > 60 ? "…" : ""}
                      </div>
                      <div className="mt-1 truncate text-sm text-slate-600">
                        Output: {(run.final_output || "").slice(0, 80)}
                        {(run.final_output?.length ?? 0) > 80 ? "…" : ""}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
