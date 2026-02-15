# AI Notes – FlowForge

## Tools used

Cursor and ChatGPT were used to generate and refine code, structure, and documentation.

## Gemini model and rationale

- Model: gemini-1.5-flash
- Reason: Free tier, low latency, good for short tasks (clean, summarize, extract, tag).

## AI-generated vs manually reviewed

- AI-generated: Project layout, Supabase and Gemini setup, prompts, server actions, all pages and components, Status page and API, styling, README and PROMPTS_USED.
- Manually reviewed: Env vars (no keys in code), error handling, validation, deployment steps, schema.

## Prompt testing strategy

Step prompts are in src/lib/prompts.ts. Tag category uses five options and asks for only the category name. Status page uses "Reply with exactly: OK" to verify Gemini connectivity.
