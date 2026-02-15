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

## Not implemented

User auth, RLS per user, streaming output, workflow edit/delete in UI.

## Future

Auth, workflow list and edit/delete, streaming, rate limiting.
