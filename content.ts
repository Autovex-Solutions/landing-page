// Single place to edit site content that changes often.
// Add a case study = add one object to `workItems` (sample: true renders the "Sample" chip).

import { siInstagram, siGithub } from "simple-icons";
import { Code2, Globe, MessageCircle, Palette, Smartphone, Zap, type LucideIcon } from "lucide-react";

// `phone` is rendered as selectable text (not only inside the tel: href) so Google
// Business Profile can corroborate the number against the profile — keep the displayed
// string identical to the number in the GBP phone field.
export const contact = {
  email: "Hello@autovexsolutions.com",
  bookingUrl: "https://calendly.com/autovexsolutions/30min",
  phone: "+92 348 2033984",
  phoneHref: "tel:+923482033984",
  whatsapp: "https://wa.me/923482033984",
};

// Supporting line under the Services heading — balances the left column
// against the orb's height on the wide desktop layout (>=1360px).
export const servicesIntro =
  "We are your full-stack engineering partners, translating initial visions into market-leading digital products. Our holistic approach integrates strategic planning, user-centric design, and robust development to deliver end-to-end solutions that are built to scale and succeed.";

// Monitor-guy hero section (components/MonitorGuyBanner.tsx) — short pitch
// over the full-bleed mouse-scrub video. Kept separate from `teardown`
// below: this is a brief, scroll-through moment, not the lead-capture pitch.
export const monitorGuyHero = {
  heading: "Intelligent systems for ambitious workflows.",
  subtext:
    "Autovex Solutions engineers automated pipelines so your team can focus on what actually matters.",
};

// Tool logos/names for the hero marquee live in components/ToolMarquee.tsx
// (names are coupled to their simple-icons imports).

// Shared with components/Nav.tsx and Footer() in sections.tsx, so the two
// never drift. "Work" only appears once there's a real case study to show —
// same rule the nav already followed.
export function getNavLinks() {
  return [
    { href: "#services", label: "Services" },
    ...(workItems.length > 0 ? [{ href: "#work", label: "Work" }] : []),
    { href: "#teardown", label: "Teardown" },
    { href: "#process", label: "Process" },
  ];
}

// Real profiles only — no placeholder/dead links. There's no X/Twitter
// account yet, so it's omitted rather than faked; add it here once one exists.
// LinkedIn's mark isn't in simple-icons (removed after a trademark request),
// so it's hand-embedded here as a plain path — same 24x24 box as the rest.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.851-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.355V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export type SocialLink = { name: string; href: string; path: string };
export const socials: SocialLink[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/autovex-solutions/", path: LINKEDIN_PATH },
  { name: "Instagram", href: "https://www.instagram.com/autovex_solutions/", path: siInstagram.path },
  { name: "GitHub", href: "https://github.com/Autovex-Solutions", path: siGithub.path },
];

export const footerBio =
  "Autovex Solutions is a premier software agency engineering high-performance SaaS products, custom web platforms, and mobile applications. We build resilient, automated technology infrastructure that helps ambitious businesses move faster, operate smarter, and scale with absolute confidence.";

export type WorkItem = {
  category: "Automation" | "Web" | "Mobile";
  title: string; // kept generic — client names stay off the page
  summary: string;
  metric: string;
  nodes?: string[]; // pipeline diagram on the rail card; first + last render amber
  sample?: boolean;
  image?: string; // path under /public — replaces the node diagram when set
};

// First three are real, shipped systems (anonymized — client names stay off the page).
// The remaining sample: true slots are placeholders for the other members' case studies.
export const workItems: WorkItem[] = [
  {
    category: "Automation",
    title: "AI video restoration & upscaler",
    summary:
      "Low-res source in, 4× frames out: an in-house restoration stage with on-demand face recovery, tuned until it held its own against paid upscalers side by side. Runs on pay-per-second GPUs, so there's no idle hardware bill.",
    metric: "4× resolution on serverless GPUs",
    image: "/work/upscale-before-after.webp",
  },
  {
    category: "Automation",
    title: "Autonomous content enrichment pipeline",
    summary:
      "Backlog in, captioned and upscaled HD out — a human only ever sees the exceptions.",
    metric: "0 human touches per video · ~700 paying users",
    nodes: ["Fetch from library", "Gemini caption + safety", "Watermark sweep", "4× HD upscale", "Publish enriched", "Exception → human"],
  },
  {
    category: "Web",
    title: "Live classroom engagement analytics",
    summary:
      "A virtual classroom that reads the room — on-device emotion AI, engagement signals only.",
    metric: "0 video frames leave the device",
    image: "/work/classroom-live.webp",
  },
  {
    category: "Web",
    title: "Booking platform rebuild",
    summary:
      "A slow five-step quote form became a fast two-screen booking flow with live pricing.",
    metric: "2.4× booking conversion",
    sample: true,
    nodes: ["Next.js front end", "Live pricing API", "Stripe checkout", "Supabase records"],
  },
  {
    category: "Mobile",
    title: "Field-ops companion app",
    summary:
      "Crews log jobs offline from site — everything syncs the moment signal returns.",
    metric: "0 paper forms since launch",
    sample: true,
    nodes: ["React Native app", "Offline job queue", "Background sync", "Ops dashboard"],
  },
];

// The free-teardown offer + its lead-capture card (TeardownCard.tsx).
export const teardown = {
  eyebrow: "Free teardown",
  heading: "Send us your worst workflow.",
  headingDim: "We'll show you the math.",
  body: "Describe your worst workflow below and get an instant estimate of the hours it's costing you. The engineered version, with your real numbers, lands in your inbox within 48 hours.",
  placeholder:
    "e.g. Every order lands in our inbox as a PDF, we retype it into the CRM, invoice it in QuickBooks, then chase the driver on WhatsApp…",
  sample:
    "We copy every invoice PDF into the CRM by hand, then chase missing fields over email for days.",
  ctaLabel: "Get the engineered version, free, 48h",
  mobileCta: "Get free teardown (48h)",
  mailSubject: "Teardown request",
};

export const steps = [
  {
    title: "Discover",
    body: "We learn how your business operates, identify challenges, and define the best technical approach before a single line of code is written.",
  },
  {
    title: "Design",
    body: "We craft intuitive user experiences, scalable architecture, and a clear roadmap that aligns technology with your business goals.",
  },
  {
    title: "Build",
    body: "Our team develops, tests, and integrates your solution using modern technologies, keeping you involved throughout every milestone.",
  },
  {
    title: "Launch & Scale",
    body: "After deployment, we monitor, optimize, and continuously improve your product so it grows alongside your business.",
  },
];

// Mobile accordion copy (components/ServicesAccordion.tsx). Desktop keeps the
// hand-built flow-diagram cards in components/sections.tsx; this is the same three
// services condensed to a 2-line summary + expandable bullets for small screens.
export type ServiceItem = {
  tag: string;
  title: string;
  summary: string;
  bullets: string[];
};

export const services: ServiceItem[] = [
  {
    tag: "01 / Automation",
    title: "Workflows that run themselves",
    summary:
      "We wire your tools together into pipelines that handle the busywork end to end.",
    bullets: [
      "CRM, inbox, sheets & invoicing wired into one pipeline",
      "AI where it helps, deterministic where it matters",
      "Runs unattended — exceptions are the only thing a human sees",
    ],
  },
  {
    tag: "02 / Web",
    title: "Sites & platforms that sell",
    summary:
      "Fast, search-friendly marketing sites and web apps built to convert, not just to exist.",
    bullets: [
      "Next.js builds tuned for real Core Web Vitals",
      "SEO-first structure, not bolted on after launch",
      "Conversion-focused UX from first scroll to checkout",
    ],
  },
  {
    tag: "03 / Mobile",
    title: "Mobile apps built for growth",
    summary:
      "High-performance iOS and Android apps engineered for speed, scale and exceptional UX.",
    bullets: [
      "Native-grade performance on iOS & Android",
      "Architecture that scales from first 100 users to first 100k",
      "Offline-ready, sync-safe where the job needs it",
    ],
  },
];

// Desktop Services grid (components/FeatureGrid.tsx) — replaces the old
// hand-built flow-diagram cards (FlowDemo/WebDemo/MobileDemo, removed).
// First 3 entries intentionally match `services` above word-for-word so
// desktop/mobile never say different things about the same three services.
// The other 3 are real, already-true things about Autovex, not filler:
// "Custom software" and "UI/UX design" are already in the site's own SEO
// description (app/layout.tsx); "Direct founder access" is backed by the
// named founder emails in that same file's JSON-LD.
export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const features: FeatureItem[] = [
  {
    id: "01",
    title: "Workflows that run themselves",
    description:
      "We wire your tools together into pipelines that handle the busywork end to end. AI where it helps, deterministic where it matters.",
    Icon: Zap,
  },
  {
    id: "02",
    title: "Custom software",
    description:
      "Beyond off-the-shelf tools — internal dashboards, admin panels and bespoke systems built around how your business actually operates.",
    Icon: Code2,
  },
  {
    id: "03",
    title: "Sites & platforms that sell",
    description:
      "Fast, search-friendly marketing sites and web apps built to convert, not just to exist.",
    Icon: Globe,
  },
  {
    id: "04",
    title: "Mobile apps built for growth",
    description:
      "High-performance iOS and Android apps engineered for speed, scale and exceptional UX.",
    Icon: Smartphone,
  },
  {
    id: "05",
    title: "UI/UX design",
    description:
      "Interfaces designed to be used, not just looked at — wireframes through to polished, production-ready screens.",
    Icon: Palette,
  },
  {
    id: "06",
    title: "Direct founder access",
    description:
      "No account managers or ticket queues — you talk directly with the people building your product, by email or WhatsApp.",
    Icon: MessageCircle,
  },
];