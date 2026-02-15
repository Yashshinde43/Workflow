"use server";

import { createClient } from "@/lib/supabase/server";
import { generateWithGemini } from "@/lib/gemini";
import { getPromptForStep } from "@/lib/prompts";
import { STEP_DEFINITIONS } from "@/types/database";
import type { WorkflowStepId } from "@/types/database";
import type { StepOutputEntry } from "@/types/database";
import { revalidatePath } from "next/cache";

export type RunWorkflowResult =
  | { success: true; runId: string; stepOutputs: StepOutputEntry[]; finalOutput: string }
  | { success: false; error: string };

export async function runWorkflow(
  workflowId: string,
  inputText: string
): Promise<RunWorkflowResult> {
  const text = inputText?.trim() ?? "";
  if (!text) {
    return { success: false, error: "Input text is required." };
  }

  try {
    const supabase = createClient();
    const { data: workflow, error: fetchError } = await supabase
      .from("workflows")
      .select("id, name, steps")
      .eq("id", workflowId)
      .single();

    if (fetchError || !workflow) {
      return { success: false, error: "Workflow not found." };
    }

    const steps = (workflow.steps as WorkflowStepId[]) ?? [];
    if (steps.length < 2) {
      return { success: false, error: "Workflow must have at least 2 steps." };
    }

    const stepOutputs: StepOutputEntry[] = [];
    let currentInput = text;

    for (const stepId of steps) {
      const def = STEP_DEFINITIONS[stepId];
      const stepName = def?.label ?? stepId;
      const prompt = getPromptForStep(stepId, currentInput);
      let output: string;
      try {
        output = await generateWithGemini(prompt);
      } catch (geminiErr) {
        const msg =
          geminiErr instanceof Error ? geminiErr.message : "Gemini API failed.";
        return {
          success: false,
          error: `Step "${stepName}" failed: ${msg}`,
        };
      }
      stepOutputs.push({ stepId, stepName, output });
      currentInput = output;
    }

    const finalOutput = currentInput;

    const { data: run, error: insertError } = await supabase
      .from("runs")
      .insert({
        workflow_id: workflowId,
        input_text: text,
        step_outputs: stepOutputs,
        final_output: finalOutput,
      })
      .select("id")
      .single();

    if (insertError) {
      return { success: false, error: insertError.message || "Failed to save run." };
    }
    revalidatePath("/runs");
    revalidatePath(`/run/${workflowId}`);
    return {
      success: true,
      runId: run.id,
      stepOutputs,
      finalOutput,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Run failed.";
    return { success: false, error: message };
  }
}
