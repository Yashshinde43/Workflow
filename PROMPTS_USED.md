
# Prompts Used – FlowForge

This document describes the prompts used to generate and refine the app. **No API keys or secrets are included.**

## App generation

- **Initial request:** Full specification for “FlowForge – Workflow Builder Lite” including tech stack (Next.js 14, TypeScript, Tailwind, Supabase, Gemini), core features (Home, Create Workflow, Run Workflow, Runs, Status), database tables, Gemini integration, validation, and required files (README, AI_NOTES, ABOUTME, PROMPTS_USED).
- **Refinement:** None beyond the initial spec; implementation followed the spec and standard patterns.

## In-app Gemini prompts (step templates)

Defined in `src/lib/prompts.ts`. Placeholders like `{{input}}` are replaced with the actual input text for each step.

1. **Clean Text**  
   `"Clean the following text by fixing grammar and formatting:\n{{input}}"`

2. **Summarize**  
   `"Summarize the following text in 5 concise lines:\n{{input}}"`

3. **Extract Key Points**  
   `"Extract bullet-point key insights from the following text:\n{{input}}"`

4. **Tag Category**  
   `"Classify the following text into one category:\nTechnology, Finance, Health, Education, Other.\nReturn only the category name.\n\nText:\n{{input}}"`

## Status check

- **Gemini health check:**  
  `"Reply with exactly: OK"`  
  Used on the Status page and in the status API to verify the Gemini API key and connectivity without affecting app data.

## Prompt refinement process

- Step prompts were taken from the project specification and implemented as templates.
- Tag category was limited to the five options above and “Return only the category name” to keep responses consistent and parseable.
- No iterative prompt A/B testing was done; future improvements could include testing summarization length and extraction format with real users.
