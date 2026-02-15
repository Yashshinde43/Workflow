import type { WorkflowStepId } from "@/types/database";

const TEMPLATES: Record<WorkflowStepId, (input: string) => string> = {
  clean: (input) =>
    `Clean the following text by fixing grammar and formatting:\n${input}`,
  summarize: (input) =>
    `Summarize the following text in 5 concise lines:\n${input}`,
  extract: (input) =>
    `Extract bullet-point key insights from the following text:\n${input}`,
  tag: (input) =>
    `Classify the following text into one category:\nTechnology, Finance, Health, Education, Other.\nReturn only the category name.\n\nText:\n${input}`,
};

export function getPromptForStep(stepId: WorkflowStepId, input: string): string {
  return TEMPLATES[stepId](input);
}
