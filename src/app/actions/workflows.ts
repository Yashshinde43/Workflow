"use server";

import { createClient } from "@/lib/supabase/server";
import type { WorkflowStepId } from "@/types/database";
import { revalidatePath } from "next/cache";

const MIN_STEPS = 2;
const MAX_STEPS = 4;

export type CreateWorkflowResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function createWorkflow(
  name: string,
  steps: WorkflowStepId[]
): Promise<CreateWorkflowResult> {
  const trimmedName = name?.trim() ?? "";
  if (!trimmedName) {
    return { success: false, error: "Workflow name is required." };
  }
  if (!Array.isArray(steps) || steps.length < MIN_STEPS || steps.length > MAX_STEPS) {
    return { success: false, error: "Select between 2 and 4 steps." };
  }
  const validIds: WorkflowStepId[] = ["clean", "summarize", "extract", "tag"];
  const validSteps = steps.filter((s): s is WorkflowStepId => validIds.includes(s));
  if (validSteps.length < MIN_STEPS) {
    return { success: false, error: "Select at least 2 valid steps." };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workflows")
      .insert({ name: trimmedName, steps: validSteps })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message || "Failed to create workflow." };
    }
    revalidatePath("/");
    revalidatePath("/runs");
    return { success: true, id: data.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create workflow.";
    return { success: false, error: message };
  }
}
