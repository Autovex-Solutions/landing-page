// Single place to edit site content that changes often.
// Add a case study = add one object to `workItems` (sample: true renders the "Sample" chip).

export const contact = {
  email: "hello@autovex.solutions", // TODO: real address
  bookingUrl: "#", // TODO: Cal.com / Calendly link
};

// Tool logos/names for the hero marquee live in components/ToolMarquee.tsx
// (names are coupled to their simple-icons imports).

export type WorkItem = {
  category: "Automation" | "Web" | "Mobile";
  title: string; // kept generic — client names stay off the page
  summary: string;
  metric: string;
  nodes?: string[]; // pipeline diagram on the rail card; first + last render amber
  sample?: boolean;
  image?: string; // path under /public — replaces the node diagram when set
};

// Representative builds (sample: true) until real case studies ship.
// Swapping in a real one = replace an object here; the rail redraws itself.
export const workItems: WorkItem[] = [
  {
    category: "Automation",
    title: "Invoice intake pipeline",
    summary:
      "Order PDFs used to be retyped into the CRM by hand. Now they're parsed, matched and posted the minute they land — a human only sees the exceptions.",
    metric: "11 hrs/week returned to the team",
    sample: true,
    nodes: ["Inbox — invoice PDF", "Extract line items", "Match against PO", "Post to QuickBooks", "Exception → human"],
  },
  {
    category: "Web",
    title: "Booking platform rebuild",
    summary:
      "A slow five-step quote form became a two-screen booking flow with live pricing. Same traffic, more than twice the bookings.",
    metric: "2.4× booking conversion",
    sample: true,
    nodes: ["Next.js front end", "Live pricing API", "Stripe checkout", "Supabase records"],
  },
  {
    category: "Automation",
    title: "Lead routing engine",
    summary:
      "Every form fill is enriched, scored and in the right rep's hands with a drafted reply — before a competitor has opened the notification.",
    metric: "4 sec from form to rep",
    sample: true,
    nodes: ["Form submitted", "Enrich & score", "Draft reply", "Assign to rep", "CRM updated"],
  },
  {
    category: "Mobile",
    title: "Field-ops companion app",
    summary:
      "Crews log jobs offline from site; everything syncs when signal returns and the office dashboard updates itself. Paper forms retired.",
    metric: "0 paper forms since launch",
    sample: true,
    nodes: ["React Native app", "Offline job queue", "Background sync", "Ops dashboard"],
  },
  {
    category: "Automation",
    title: "Support triage copilot",
    summary:
      "Inbound tickets are classified, answered straight from the docs where possible, and escalated with full context where not.",
    metric: "68% resolved without a human",
    sample: true,
    nodes: ["Ticket arrives", "Classify intent", "Draft from docs", "Escalate w/ context"],
  },
];

// The free-teardown offer + the interactive pipeline sketcher next to it.
export const teardown = {
  eyebrow: "Free teardown",
  heading: "Send us your worst workflow.",
  headingDim: "We'll show you the math.",
  body: "The panel below is sketching real workflows on a loop — the busywork, then the pipeline that replaces it. Click in, type yours, and watch it redraw. The engineered version, with your real numbers, lands in your inbox within 48 hours.",
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
