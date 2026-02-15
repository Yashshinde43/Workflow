"use client";

import { useState } from "react";
import Link from "next/link";
import { runWorkflow } from "@/app/actions/runs";
import { STEP_DEFINITIONS } from "@/types/database";
import type { StepOutputEntry } from "@/types/database";
import { Spinner } from "@/components/Spinner";
import { Toast } from "@/components/Toast";

type Props = {
  workflowId: string;
  workflowName: string;
  steps: string[];
};

export default function RunWorkflowClient({
  workflowId,
  workflowName,
  steps,
}: Props) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [result, setResult] = useState<{
    stepOutputs: StepOutputEntry[];
    finalOutput: string;
  } | null>(null);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const text = inputText.trim();
    if (!text) {
      setError("Please enter some text to run the workflow.");
      setToast({ message: "Input text is required.", type: "error" });
      return;
    }
    setLoading(true);
    const res = await runWorkflow(workflowId, text);
    setLoading(false);
    if (res.success) {
      setResult({ stepOutputs: res.stepOutputs, finalOutput: res.finalOutput });
      setToast({ message: "Workflow completed.", type: "success" });
    } else {
      setError(res.error);
      setToast({ message: res.error, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link href="/" className="text-slate-600 hover:text-slate-800">
            ← Home
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Run: {workflowName}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <form onSubmit={handleRun} className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <label htmlFor="input" className="block text-sm font-medium text-slate-700">
              Input text
            </label>
            <textarea
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type text here..."
              rows={6}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? <Spinner className="text-white" /> : null}
                {loading ? "Running…" : "Run Workflow"}
              </button>
              <Link
                href="/runs"
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                View run history
              </Link>
            </div>
          </section>
        </form>

        {loading && (
          <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 text-slate-600">
              <Spinner />
              <span>Executing steps with Gemini…</span>
            </div>
          </section>
        )}

        {result && !loading && (
          <section className="mt-6 space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Step outputs
            </h2>
            <div className="space-y-4">
              {result.stepOutputs.map((step, i) => {
                const isFinal = i === result.stepOutputs.length - 1;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 transition-all ${
                      isFinal
                        ? "border-blue-200 bg-blue-50/80 shadow-sm"
                        : "border-slate-200 bg-white/80"
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
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/80 p-4">
              <h3 className="mb-2 text-sm font-semibold text-blue-900">Final output</h3>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
                {result.finalOutput || "(empty)"}
              </pre>
            </div>
          </section>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
