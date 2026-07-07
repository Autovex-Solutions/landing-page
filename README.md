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
- Confirm the "$3–10k, 3–6 weeks" engagement range in `content.ts` (currently a placeholder guess)
- Real case studies (add to `workItems` — they render above the teardown panel)
- Founder photo next to the CTA founder line
- Hero background: generative dot-wave is the default; run dev and use the on-page arrows
  (dev-only picker) to compare against the clip candidates in `public/videos/` (git-ignored).
  If a clip wins, promote it to `public/hero-loop.mp4` compressed (1080p, strip audio, <4MB)
  and unhide the `<video>` in `Hero`
- Tune `TeardownSketch` keyword rules / hours heuristics as real teardowns calibrate them
- OG image, analytics
- Pipeline demo + pitch mockup generator: see `PLAN_pipeline-engine.md`
