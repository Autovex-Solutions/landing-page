# Autovex Solutions — Landing Page

Dark, cinematic single-page site for Autovex Solutions (automation · web · mobile).
Design direction: Mosa AI template vibe, rebuilt from scratch. Next.js App Router + Tailwind v4, fully static, deploys anywhere (Vercel-ready).

## Editing content

- **Copy that changes often** (case studies, stack list, contact/booking links): `content.ts`. Adding a case study = adding one object to `workItems`.
- **Section copy/layout**: `components/sections.tsx` — one exported component per section (Nav, Hero, Services, Projects, Teardown, Process, Cta, Footer).
- **All styling**: `app/globals.css` (design tokens at the top; Tailwind available for new work).
- **Grain + scroll reveals + reduced-motion handling**: `components/Effects.tsx` (only client component).

## Assets

- `public/logo-*.png` — brand marks; originals in `reference/`.
- Hero background is the generative dot-wave (`components/DottedWave.tsx`) — finalized, no video.

## TODO (iterative)

- Real booking link + email in `content.ts`
- Confirm the "$3–10k, 3–6 weeks" engagement range in `content.ts` (currently a placeholder guess)
- Real case studies (`workItems` currently holds 5 sample placeholders — replace with real ones as they ship)
- Founder photo next to the CTA founder line
- Tune `TeardownSketch` keyword rules / hours heuristics as real teardowns calibrate them;
  swap in the LLM-backed engine once `PLAN_pipeline-engine.md` infra exists
- OG image, analytics
- Pipeline demo + pitch mockup generator: see `PLAN_pipeline-engine.md`
