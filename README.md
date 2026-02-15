# FlowForge – Workflow Builder Lite

A full-stack web app to build and run simple text automation workflows (2–4 steps) powered by Google Gemini. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Overview

FlowForge lets you create workflows with 2–4 steps (Clean Text, Summarize, Extract Key Points, Tag Category), run them on input text via the Gemini API, and view step outputs and run history.

## Features

- **Home (/)** – Intro, Create Workflow, View Runs, Status Page links
- **Create Workflow (/workflow/new)** – Name and 2–4 steps; stored in Supabase
- **Run Workflow (/run/[id])** – Input text, run, see step outputs and final result
- **Run History (/runs)** – Last 5 runs; click for full details
- **Run Detail (/runs/[id])** – Input, step outputs, final output
- **Status (/status)** – Backend, Database, Gemini health

## Setup

1. Install: `npm install`
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase dashboard)
   - `GEMINI_API_KEY` (Google AI Studio)
3. Run `supabase/schema.sql` in Supabase SQL Editor
4. Run: `npm run dev`

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `GEMINI_API_KEY` – Google Gemini API key (server-only)

## Deployment (Vercel)

Add the three env vars in Vercel, connect the repo, and deploy. No extra config needed.

## Implemented

Next.js 14 App Router, TypeScript, Tailwind, Supabase, Gemini (gemini-1.5-flash), all core pages, validation, error and loading UI, toast, .env.example.

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
