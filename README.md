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

## Privacy and Compliance Checklist

- Policy views are available in the app for privacy, terms, cookies, and refunds.
- The current client has no analytics SDK, advertising pixel, social iframe, or optional tracking cookie.
- Necessary browser storage is disclosed by the cookie notice; authentication providers may set their own session storage.
- Account creation, opportunity publishing, and collaboration proposals require an explicit confirmation before submission.
- Public images are loaded from Unsplash and fonts from Google Fonts. Keep a license/source record, confirm third-party terms, and self-host approved assets before production if required by the operator's privacy or procurement review.
- Before launch, replace the policy draft notice with the registered operator name, business address, privacy/support email, grievance contact, retention schedule, deletion process, and applicable jurisdiction-specific rights.
- For India-facing operations, obtain legal review against the Digital Personal Data Protection Act, 2023 and rules or notifications in force at launch. Reassess the notice and consent model before targeting the EEA, UK, California, or other jurisdictions.
- Do not enable payments, document uploads, analytics, monitoring, chat, marketing pixels, or additional embeds without updating the data map, vendor contracts, cookie inventory, consent controls, and relevant policies.

## Current Limitations

This project is an active prototype. Production hardening still includes administrator approval tooling, secure document upload and verification, consent and audit controls, interview and offer workflows, notifications, external learning integrations, automated tests, and role-based code splitting.

The production build currently reports a bundle-size warning because the main JavaScript chunk is larger than Vite's default 500 KB threshold.
