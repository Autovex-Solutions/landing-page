<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autovex Solutions — Landing Page

Single-page marketing site for Autovex Solutions, a services agency (priority order: automation, web dev, mobile apps). Design direction: dark cinematic — near-black, monospace accents, big Archivo headlines, glassmorphism on elements over the hero background. Brand: black/white + one phosphor-amber accent (`--accent`, control-room status-light; keep it scarce — buttons, dots, metrics). Logo = geometric V + dot. Fully static; keep it that way unless a feature genuinely needs a server.

## Design philosophy

Dark control room, not "dark-mode SaaS". Every visual decision routes through these:

- **One accent, rationed.** Phosphor amber is a status light — it marks live/important things (trigger nodes, metrics, the orbit satellite, primary buttons). If a design uses amber for decoration, it's wrong.
- **Zero border-radius on UI.** Panels, chips, buttons, cards, inputs: square. Circles are reserved for status dots, wave dots and orbital rings — points and orbits, not containers.
- **Type is the brand.** Archivo, tight-tracked, for headlines; IBM Plex Mono uppercase at 10–13px for every label, eyebrow, chip and metric. Mono text carries the machine-room voice — prefer a labelled mono chip over an icon.
- **Glass, one recipe.** `rgba(242,241,238, .05–.13)` fill + 1px hairline border + `backdrop-filter: blur(16–24px) saturate(1.3)`. Used only where something sits over imagery/canvas (nav, hero buttons, rail controls).
- **No external assets.** No CDN icon packs, no stock photos, no client-logo soup. Integrations are tool names as mono chips; case studies are pipeline diagrams drawn from the house node/chip primitives.
- **Motion is ambient and answerable.** Masked word-rises, scroll reveals, slow canvas/CSS loops (dot-wave, orbit rings, marquee). Everything pauses offscreen where it costs CPU, and everything has a `prefers-reduced-motion` fallback that still looks finished (static frame, not blank).
- **Dropped-in components get translated, not pasted.** Third-party snippets (shadcn/framer-motion/Tailwind-idiom) are rebuilt in the house idiom: radii squared off, emerald/blue remapped to amber/ink, deps replaced with CSS + small hooks where they'd only serve one effect (precedent: DottedWave skipped three.js, FocusRail skipped framer-motion).
- **One conversion goal.** Book a call. New sections may support it (proof, trust, delight) but never compete with it — no email capture, no second funnel.

## File map

- `content.ts` — all frequently-edited content: case studies (`workItems` — add a project by adding one object; `sample: true` renders the "Sample" chip; `nodes` draws the card's pipeline diagram; currently 5 representative samples), integration marquee lists (`integrations`), teardown offer (`teardown`), founder line, tool stack list, contact email, booking URL. Copy changes go here first.
- `app/page.tsx` — just composes the sections, in order.
- `components/Nav.tsx` — client component: sticky nav, transparent over the hero, condenses into a floating glass bar past 10px of scroll; mobile burger → full-height sheet (scroll-locked, Escape closes).
- `components/sections.tsx` — one exported server component per section: Hero, Services, Projects (FocusRail of `workItems`; renders nothing and hides its nav link while empty), Teardown (offer + sketcher), Process, Cta (orbit rings + integration marquee + booking CTA), Footer. Split a section into its own file when it grows (e.g. gets animation).
- `components/FocusRail.tsx` — client component: 3D coverflow rail for work items (CSS transitions, no framer-motion); cards render `nodes` as a mini pipeline diagram (or `image` when set); pointer swipe, arrow keys, prev/next controls.
- `components/Effects.tsx` — client component: film-grain canvas, IntersectionObserver scroll reveals, reduced-motion handling (disables reveals).
- `components/DottedWave.tsx` — client component: canvas-2D dotted sine surface (deliberately no three.js); `variant="hero"` is the finalized hero background (no video); pauses offscreen, static frame under reduced motion. (The CTA now uses the CSS `.orbit` rings instead of the `cta` variant.)
- `components/TeardownSketch.tsx` — client component: idles as a self-running demo (auto-types 3 pre-baked workflows and draws their hand-authored pipeline diagrams on a loop) until the visitor clicks the textarea; then keyword-heuristic sketch of their text + hours estimate; mailto handoff carries the typed text. Real LLM engine: `PLAN_pipeline-engine.md`.
- `PLAN_pipeline-engine.md` — unbuilt plan: live pipeline demo + pitch mockup generator on external n8n infra.
- `app/globals.css` — ALL styling. Design tokens (colors, fonts, spacing) are CSS variables at the top of `:root`; section styles below, grouped by section. Tailwind v4 is imported and available, but existing styles are plain CSS classes — match whichever the file you're touching uses.
- `app/layout.tsx` — fonts via next/font (Archivo → `--font-archivo`, IBM Plex Mono → `--font-plex-mono`; the variable classes MUST stay on `<html>`, not `<body>`, or the `:root` `--sans`/`--mono` tokens silently fall back to system fonts), metadata + JSON-LD, mounts Effects.
- `public/logo-*.png`, `app/icon.png` — brand marks; all original logo variants live in `reference/` (1–4 = 1000px, 5–8 = 500px; odd numbers dark-on-light, even white-on-dark; 5/8 white-on-transparent).

## Conventions

- New interactive/animated pieces: separate client component wrapping only the animated part; the page stays static. Follow the Effects.tsx pattern; always respect `prefers-reduced-motion`.
- Single conversion goal: "book a call". Don't add competing CTAs.
- Verify with `npm run build` — it must stay all-static (every route marked ○).

## Known placeholders (as of 2026-07)

Booking URL (`#`), contact email, engagement price range in `steps`, sample teardown report numbers, case studies (`workItems` holds 5 `sample: true` representative builds — swap for real ones as they ship). All listed in README TODO.
