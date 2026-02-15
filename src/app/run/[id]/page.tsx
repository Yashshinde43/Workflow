import RunWorkflowClient from "./RunWorkflowClient";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function RunWorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();
  const { data: workflow, error } = await supabase
    .from("workflows")
    .select("id, name, steps")
    .eq("id", id)
    .single();

  if (error || !workflow) notFound();

  return (
    <RunWorkflowClient
      workflowId={workflow.id}
      workflowName={workflow.name}
      steps={workflow.steps as string[]}
    />
  );
}
