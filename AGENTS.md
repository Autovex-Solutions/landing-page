<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autovex Solutions — Landing Page

Single-page marketing site for Autovex Solutions, a services agency (priority order: automation, web dev, mobile apps). Design direction: dark cinematic "Mosa AI" vibe — near-black, monospace accents, big Archivo headlines, ~30% glassmorphism on elements over video. Brand is strictly black/white (logo = geometric V + dot). Fully static; keep it that way unless a feature genuinely needs a server.

## File map

- `content.ts` — all frequently-edited content: case studies (`workItems` — add a project by adding one object; `sample: true` renders the "Sample" chip), tool stack list, contact email, booking URL. Copy changes go here first.
- `app/page.tsx` — just composes the sections, in order.
- `components/sections.tsx` — one exported server component per section: Nav, Hero, Services, Work, Process, Cta, Footer. Split a section into its own file when it grows (e.g. gets animation).
- `components/Effects.tsx` — the ONLY client component: film-grain canvas, IntersectionObserver scroll reveals, reduced-motion handling (pauses `.bgvid`, disables reveals).
- `app/globals.css` — ALL styling. Design tokens (colors, fonts, spacing) are CSS variables at the top of `:root`; section styles below, grouped by section. Tailwind v4 is imported and available, but existing styles are plain CSS classes — match whichever the file you're touching uses.
- `app/layout.tsx` — fonts via next/font (Archivo → `--font-archivo`, IBM Plex Mono → `--font-plex-mono`), metadata, mounts Effects.
- `public/hero-loop.mp4` — hero background video (Mixkit free-license placeholder; swap file to change footage, no code change). Pattern for video sections: `<video className="bgvid" autoPlay muted loop playsInline>` + `.veil` overlay for text legibility.
- `public/logo-*.png`, `app/icon.png` — brand marks; all original logo variants live in `reference/` (1–4 = 1000px, 5–8 = 500px; odd numbers dark-on-light, even white-on-dark; 5/8 white-on-transparent).

## Conventions

- New interactive/animated pieces: separate client component wrapping only the animated part; the page stays static. Follow the Effects.tsx pattern; always respect `prefers-reduced-motion`.
- Single conversion goal: "book a call". Don't add competing CTAs.
- Verify with `npm run build` — it must stay all-static (every route marked ○).

## Known placeholders (as of 2026-07)

Booking URL (`#`), contact email, hero video footage, both sample case studies. All listed in README TODO.
