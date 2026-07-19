# ClientFlow

ClientFlow is a role-based client delivery workspace for projects, milestones, requests, documents, invoices, and shared activity. It is a full-stack portfolio project by John Venancio.

## What the live demo proves

- Owner and client views backed by one domain model
- Create projects, requests, invoices, and document records
- Complete milestones, advance requests, and record payments
- Automatic activity history for every important action
- Persistent browser state with a safe, deterministic reset
- Zod-validated notification API with Resend support
- Supabase-ready relational schema and row-level security
- Responsive, keyboard-accessible dark interface

The public deployment runs in transparent **Portfolio demo** mode. Demo actions are stored only in the visitor's browser. This keeps the experience free, repeatable, and safe while the included Supabase migration documents the production architecture.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run check
```

This runs linting, TypeScript, unit tests, and a production build.

## Optional integrations

Copy `.env.example` to `.env.local` and add the values you want to use. The app works without them in portfolio mode.

- Supabase: apply `supabase/migrations/20260719000000_clientflow.sql` and configure the public URL and anonymous key.
- Resend: add `RESEND_API_KEY` and `NOTIFICATION_FROM_EMAIL` to send real workflow notifications.

Never expose the Supabase service-role key in browser code.

## Routes

- `/` — product landing page
- `/demo` — guided, interactive workflow
- `/dashboard` — owner workspace
- `/portal` — client workspace
- `/case-study` — product and engineering case study
- `/api/health` — deployment health check
- `/api/notify` — validated notification adapter
