// Single place to edit site content that changes often.
// Add a case study = add one object to `workItems` (sample: true renders the "Sample" chip).

export const contact = {
  email: "hello@autovex.solutions", // TODO: real address
  bookingUrl: "#", // TODO: Cal.com / Calendly link
};

export const founder = {
  name: "Ishaq",
  line: "You'll work directly with Ishaq — the engineer building it, not an account manager.",
};

export const stack = ["n8n", "Next.js", "React Native", "OpenAI", "Supabase"];

export type WorkItem = {
  title: string;
  summary: string;
  metric: string;
  sample?: boolean;
  image?: string; // path under /public, falls back to striped placeholder
};

// Empty until we ship real ones — the Teardown panel carries the section meanwhile.
export const workItems: WorkItem[] = [];

// The free-teardown offer + the interactive pipeline sketcher next to it.
export const teardown = {
  eyebrow: "Free teardown",
  heading: "Send us your worst workflow.",
  headingDim: "We'll show you the math.",
  body: "Type the process you hate. Watch the pipeline that replaces it sketch itself — right here, in seconds. The engineered version, with your real numbers, lands in your inbox within 48 hours.",
  placeholder:
    "e.g. Every order lands in our inbox as a PDF — we retype it into the CRM, invoice it in QuickBooks, then chase the driver on WhatsApp…",
  sample:
    "We copy every invoice PDF into the CRM by hand, then chase missing fields over email for days.",
  ctaLabel: "Get the engineered version — free, 48h",
  mailSubject: "Teardown request",
};

export const steps = [
  { title: "Map", body: "A short call and an audit of where your team's hours actually go." },
  {
    title: "Blueprint",
    body: "A fixed-scope plan with the expected return stated up front. Typical engagement: $3–10k, 3–6 weeks.", // TODO: confirm real range
  },
  { title: "Build", body: "Shipped in weeks, with a working demo every Friday." },
  { title: "Run", body: "We monitor, maintain and keep improving what we ship." },
];
