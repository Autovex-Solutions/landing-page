<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autovex Solutions — Landing Page

Single-page marketing site for Autovex Solutions, a services agency (priority order: automation, web dev, mobile apps). Design direction: dark cinematic — near-black, monospace accents, big Archivo headlines, glassmorphism on elements over the hero background. Brand: black/white + one phosphor-amber accent (`--accent`, control-room status-light; keep it scarce — buttons, dots, metrics). Logo = geometric V + dot. Fully static; keep it that way unless a feature genuinely needs a server.

## File map

- `content.ts` — all frequently-edited content: case studies (`workItems` — add a project by adding one object; `sample: true` renders the "Sample" chip; empty until real ones ship), teardown offer (`teardown`), founder line, tool stack list, contact email, booking URL. Copy changes go here first.
- `app/page.tsx` — just composes the sections, in order.
- `components/sections.tsx` — one exported server component per section: Nav, Hero, Services, Work (teardown offer + case grid when `workItems` non-empty), Process, Cta, Footer. Split a section into its own file when it grows (e.g. gets animation).
- `components/Effects.tsx` — client component: film-grain canvas, IntersectionObserver scroll reveals, reduced-motion handling (pauses `.bgvid`, disables reveals).
- `components/DottedWave.tsx` — client component: canvas-2D dotted sine surface (deliberately no three.js); `variant="hero"` is the default hero background, `variant="cta"` sits under the CTA; pauses offscreen, static frame under reduced motion.
- `components/TeardownSketch.tsx` — client component: textarea → keyword-heuristic n8n-style pipeline sketch + hours estimate (honest "instant sketch" framing); mailto handoff carries the typed text. Real engine: `PLAN_pipeline-engine.md`.
- `components/VideoPicker.tsx` — dev-only (NODE_ENV check in Hero) arrow switcher cycling the dot-wave + clip candidates in `public/videos/` (git-ignored); hero `<video>` is hidden unless the picker selects a clip.
- `PLAN_pipeline-engine.md` — unbuilt plan: live pipeline demo + pitch mockup generator on external n8n infra.
- `app/globals.css` — ALL styling. Design tokens (colors, fonts, spacing) are CSS variables at the top of `:root`; section styles below, grouped by section. Tailwind v4 is imported and available, but existing styles are plain CSS classes — match whichever the file you're touching uses.
- `app/layout.tsx` — fonts via next/font (Archivo → `--font-archivo`, IBM Plex Mono → `--font-plex-mono`; the variable classes MUST stay on `<html>`, not `<body>`, or the `:root` `--sans`/`--mono` tokens silently fall back to system fonts), metadata + JSON-LD, mounts Effects.
- `public/hero-loop.mp4` — hero background video (Mixkit free-license placeholder; swap file to change footage, no code change). Pattern for video sections: `<video className="bgvid" autoPlay muted loop playsInline>` + `.veil` overlay for text legibility.
- `public/logo-*.png`, `app/icon.png` — brand marks; all original logo variants live in `reference/` (1–4 = 1000px, 5–8 = 500px; odd numbers dark-on-light, even white-on-dark; 5/8 white-on-transparent).

## Conventions

- New interactive/animated pieces: separate client component wrapping only the animated part; the page stays static. Follow the Effects.tsx pattern; always respect `prefers-reduced-motion`.
- Single conversion goal: "book a call". Don't add competing CTAs.
- Verify with `npm run build` — it must stay all-static (every route marked ○).

## Known placeholders (as of 2026-07)

Booking URL (`#`), contact email, hero video footage (candidates staged in `public/videos/`), engagement price range in `steps`, sample teardown report numbers. All listed in README TODO.
