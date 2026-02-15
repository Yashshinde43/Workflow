export type WorkflowStepId = "clean" | "summarize" | "extract" | "tag";

export interface WorkflowRow {
  id: string;
  name: string;
  steps: WorkflowStepId[];
  created_at: string;
}

export interface RunRow {
  id: string;
  workflow_id: string;
  input_text: string;
  step_outputs: StepOutputEntry[];
  final_output: string;
  created_at: string;
}

export interface StepOutputEntry {
  stepId: WorkflowStepId;
  stepName: string;
  output: string;
}

export const STEP_DEFINITIONS: Record<
  WorkflowStepId,
  { id: WorkflowStepId; label: string }
> = {
  clean: { id: "clean", label: "Clean Text" },
  summarize: { id: "summarize", label: "Summarize" },
  extract: { id: "extract", label: "Extract Key Points" },
  tag: { id: "tag", label: "Tag Category" },
};

export const STEP_ORDER: WorkflowStepId[] = ["clean", "summarize", "extract", "tag"];
