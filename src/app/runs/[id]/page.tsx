import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { StepOutputEntry } from "@/types/database";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();
  const { data: run, error } = await supabase
    .from("runs")
    .select("id, workflow_id, input_text, step_outputs, final_output, created_at, workflows(name)")
    .eq("id", id)
    .single();

  if (error || !run) notFound();

  const workflowName = (run.workflows as { name?: string } | null)?.name ?? "Workflow";
  const stepOutputs = (run.step_outputs as StepOutputEntry[]) ?? [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link href="/runs" className="text-slate-600 hover:text-slate-800">
            ← Runs
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">
            Run: {workflowName}
          </h1>
          <span className="text-sm text-slate-500">
            {new Date(run.created_at).toLocaleString()}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-3">
            Input
          </h2>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm text-slate-800">
            {run.input_text || "(empty)"}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-4">
            Step outputs
          </h2>
          <div className="space-y-4">
            {stepOutputs.map((step, i) => {
              const isFinal = i === stepOutputs.length - 1;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${
                    isFinal ? "border-blue-200 bg-blue-50/80" : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {step.stepName}
                    </span>
                    {isFinal && (
                      <span className="rounded bg-blue-200/80 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Final
                      </span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
                    {step.output || "(empty)"}
                  </pre>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-blue-200 bg-blue-50/80 p-4">
          <h3 className="mb-2 text-sm font-semibold text-blue-900">Final output</h3>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
            {run.final_output || "(empty)"}
          </pre>
        </section>

        <div className="flex gap-4">
          <Link
            href={`/run/${run.workflow_id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Run again
          </Link>
          <Link
            href="/runs"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to runs
          </Link>
        </div>
      </main>
    </div>
  );
}
