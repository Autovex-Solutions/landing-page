# Autovex Solutions — Landing Page

Dark, cinematic single-page site for Autovex Solutions (automation · web · mobile).
Design direction: Mosa AI template vibe, rebuilt from scratch. Next.js App Router + Tailwind v4, fully static, deploys anywhere (Vercel-ready).

## Editing content

- **Copy that changes often** (case studies, stack list, contact/booking links): `content.ts`. Adding a case study = adding one object to `workItems`.
- **Section copy/layout**: `components/sections.tsx` — one exported component per section (Nav, Hero, Services, Work, Process, Cta, Footer).
- **All styling**: `app/globals.css` (design tokens at the top; Tailwind available for new work).
- **Grain + scroll reveals + reduced-motion handling**: `components/Effects.tsx` (only client component).

## Assets

- `public/hero-loop.mp4` — hero background video (Mixkit free license, placeholder — swap for branded footage later).
- `public/logo-*.png` — brand marks; originals in `reference/`.

## TODO (iterative)

- Real booking link + email in `content.ts`
- Real case studies (replace `sample: true` items)
- Branded hero footage, OG image, analytics
