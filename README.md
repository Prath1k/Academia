# AcademiaNexus

AcademiaNexus is a React and TypeScript portal for connecting students, academicians, industry partners, and institutions around skills, assessments, internships, placements, learning programs, and collaboration.

## Features

- Role-based workspaces for students, academicians, industry recruiters, and institutions
- Skill-based opportunity matching with mandatory skills and weighted requirements
- Assessment delivery through a public question view and server-side grading
- Persisted assessment scores, category strengths, and skill gaps
- Student applications and recruiter shortlisting
- Institution analytics for opportunity demand, cohort mastery, placements, and industry partners
- CSV export for curriculum modernization metrics
- Digital portfolio and collaboration workflow foundations
- Local mock data fallback when Supabase is not configured

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth, Postgres, Row Level Security, and RPC functions
- Lucide React icons

## Requirements

- Node.js 18 or newer
- npm
- A Supabase project for live data and authentication

## Local Setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

Without Supabase credentials, the app runs with the mock data in `src/data/mockFallbackData.ts`. Local mutations remain available during the browser session.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the complete contents of `supabase/schema.sql`.
4. Confirm that the seed records at the end of the schema were inserted.
5. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Restart the Vite development server.
7. Verify the live database:

```bash
npm run verify:backend
```

The verification script checks table access and warns when the schema exists but the live tables are mostly empty.

## Available Commands

```bash
npm run dev             # Start the development server
npm run build           # Type-check and create a production build
npm run preview         # Preview the production build locally
npm run verify:backend  # Check Supabase table access and seed population
```

## Project Structure

```text
src/
  components/       Role portals, modals, navigation, and charts
  data/             Local fallback data
  services/         Auth, Supabase, matching, and data access services
  types/            Shared TypeScript database models
supabase/
  schema.sql        Database schema, RLS policies, RPC grading, and seed data
scripts/
  verify-backend.js  Supabase connectivity and population check
```

## Security Notes

- Assessment clients read from `assessment_questions_public`, which excludes answer keys.
- Assessment grading runs through the `grade_assessment` security-definer RPC.
- New self-registered non-student roles remain pending until approved in the database.
- Opportunity skills are saved separately from opportunity records and protected by owner policies.
- Use private Supabase Storage buckets and signed URLs before adding production document uploads.

## Current Limitations

This project is an active prototype. Production hardening still includes administrator approval tooling, secure document upload and verification, consent and audit controls, interview and offer workflows, notifications, external learning integrations, automated tests, and role-based code splitting.

The production build currently reports a bundle-size warning because the main JavaScript chunk is larger than Vite's default 500 KB threshold.
