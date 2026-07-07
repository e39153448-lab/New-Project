# Rocket Club Math at Home

A membership platform that helps caregivers (nannies, parents, grandparents, au pairs) turn
everyday time with a child into structured math learning — weekly missions, printed worksheets,
collectible character cards, milestones, and monthly certifications.

This is an MVP with seeded demo data covering the full funnel: public marketing site → inquiry →
caregiver training → Mission Control → diagnostics → weekly missions → milestones → cards → pins
→ certifications, plus a parent portal and an internal admin dashboard.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **PostgreSQL** + **Prisma 7** (new `prisma-client` generator with the `@prisma/adapter-pg` driver
  adapter — Prisma 7's client engine requires an explicit adapter, it no longer talks to Postgres
  via an implicit engine binary)
- **Custom cookie-based auth** (bcrypt + signed JWT via `jose`, role-aware `proxy.ts` route
  guard — Next 16 renamed `middleware.ts` to `proxy.ts`). NextAuth/Clerk were considered per the
  original spec, but a small hand-rolled session layer was simpler to get working reliably against
  a framework version this new.
- Hand-rolled Tailwind UI primitives (button/card/badge/input/select/progress) in
  `src/components/ui` in the spirit of shadcn/ui, rather than pulling in the shadcn CLI.

## Getting started

```bash
npm install
cp .env.example .env   # then point DATABASE_URL at your own Postgres instance
npx prisma migrate dev
npm run db:seed
npm run dev
```

## Demo logins

| Role      | Email                        | Password    |
| --------- | ----------------------------- | ----------- |
| Admin     | admin@rocketclub.com          | admin123    |
| Parent    | jamie.chen@example.com        | password123 |
| Caregiver | maria.lopez@example.com       | password123 |

The seed also creates a second, less-progressed family (Priya Patel / child Liam) with a pending
caregiver invite, so `/invite/[token]` and the empty/early states are easy to click through —
grab the invite token from `/admin/families` or the `CaregiverInvite` table.

## What's implemented vs. simplified for the MVP

- **Stripe**: membership status (`free_trial` / `active` / `past_due` / `canceled`) and trial
  dates are modeled and shown in the Parent → Billing page, but no live Stripe integration is
  wired up, per the brief.
- **Shop / redemption**: cards are unlocked by spending Rocket Fuel directly from the Cards page;
  a separate posters/avatar-items/surprise-rewards shop wasn't built since it wasn't in the
  required routes list.
- **Admin content editing**: Inquiries, Families, Shipments, and Children (level + caregiver
  assignment) have full inline editing. Missions/Milestones/Certifications/Cards/Pins expose
  inline editing for their most important fields (title, description, rewards, rarity) as a
  representative pattern rather than a full field-by-field CMS for every column.
- **Emails**: caregiver invites generate a real `/invite/[token]` link shown in the parent's
  dashboard to copy/send — there's no outbound email sending in this MVP.
