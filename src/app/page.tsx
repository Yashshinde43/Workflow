import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
            FlowForge
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">Workflow Builder Lite</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h2 className="text-lg font-medium text-slate-800">Welcome</h2>
          <p className="mt-3 text-slate-600">
            FlowForge lets you build simple text automation workflows with 2 to 4 steps (Clean Text, Summarize, Extract Key Points, Tag Category) powered by AI. Create a workflow, run it on your text, and view the output of each step.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/workflow/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create Workflow
            </Link>
            <Link
              href="/runs"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View Runs
            </Link>
            <Link
              href="/status"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Status Page
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
