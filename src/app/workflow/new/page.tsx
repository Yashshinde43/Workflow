"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createWorkflow } from "../../actions/workflows";
import { STEP_DEFINITIONS, STEP_ORDER } from "@/types/database";
import type { WorkflowStepId } from "@/types/database";
import { Spinner } from "@/components/Spinner";
import { Toast } from "@/components/Toast";

const MIN_STEPS = 2;
const MAX_STEPS = 4;

export default function NewWorkflowPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<WorkflowStepId[]>(["clean", "summarize"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const toggle = (id: WorkflowStepId) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((s) => s !== id);
        return next.length >= MIN_STEPS ? next : prev;
      }
      if (prev.length >= MAX_STEPS) return prev;
      return [...prev, id];
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Workflow name is required.");
      return;
    }
    if (selected.length < MIN_STEPS || selected.length > MAX_STEPS) {
      setError(`Select between ${MIN_STEPS} and ${MAX_STEPS} steps.`);
      return;
    }
    setLoading(true);
    const result = await createWorkflow(trimmed, selected);
    setLoading(false);
    if (result.success) {
      setToast({ message: "Workflow created.", type: "success" });
      router.push(`/run/${result.id}`);
    } else {
      setError(result.error);
      setToast({ message: result.error, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link href="/" className="text-slate-600 hover:text-slate-800">
            ← Home
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Create Workflow</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
        >
          <label className="block text-sm font-medium text-slate-700">Workflow name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Content pipeline"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-slate-700">
              Steps (select {MIN_STEPS}–{MAX_STEPS})
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {STEP_ORDER.map((id) => {
                const def = STEP_DEFINITIONS[id];
                const checked = selected.includes(id);
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      checked
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    {def.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Spinner className="text-white" /> : null}
              Create workflow
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
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
