// Single place to edit site content that changes often.
// Add a case study = add one object to `workItems` (sample: true renders the "Sample" chip).

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

// First three are real, shipped systems (anonymized — client names stay off the page).
// The remaining sample: true slots are placeholders for the other members' case studies.
export const workItems: WorkItem[] = [
  {
    category: "Automation",
    title: "Autonomous content enrichment pipeline",
    summary:
      "A media library's backlog goes in one side and comes out captioned, safety-rated, de-watermarked and upscaled to HD. Crash-safe, budget-capped, and it throttles itself to the AI vendor's real rate limits. A human only ever sees the flagged exceptions.",
    metric: "0 human touches per video · ~700 paying users",
    nodes: ["Fetch from library", "Gemini caption + safety", "Watermark sweep", "4× HD upscale", "Publish enriched", "Exception → human"],
  },
  {
    category: "Automation",
    title: "AI video restoration & upscaler",
    summary:
      "Low-res source in, 4× frames out: an in-house restoration stage with on-demand face recovery, tuned until it held its own against paid upscalers side by side. Runs on pay-per-second GPUs, so there's no idle hardware bill.",
    metric: "4× resolution on serverless GPUs",
    image: "/work/upscale-before-after.webp",
  },
  {
    category: "Web",
    title: "Live classroom engagement analytics",
    summary:
      "A virtual classroom that reads the room: emotion AI runs in each student's browser and streams only engagement signals, so instructors watch attention rise, dip and recover live — then get the post-session report.",
    metric: "0 video frames leave the device",
    image: "/work/classroom-live.webp",
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
    category: "Mobile",
    title: "Field-ops companion app",
    summary:
      "Crews log jobs offline from site; everything syncs when signal returns and the office dashboard updates itself. Paper forms retired.",
    metric: "0 paper forms since launch",
    sample: true,
    nodes: ["React Native app", "Offline job queue", "Background sync", "Ops dashboard"],
  },
];

// The free-teardown offer + the interactive pipeline sketcher next to it.
export const teardown = {
  eyebrow: "Free teardown",
  heading: "Send us your worst workflow.",
  headingDim: "We'll show you the math.",
  body: "The panel below is sketching real workflows on a loop, the busywork, then the pipeline that replaces it. Click in, type yours, and watch it redraw. The engineered version, with your real numbers, lands in your inbox within 48 hours.",
  placeholder:
    "e.g. Every order lands in our inbox as a PDF, we retype it into the CRM, invoice it in QuickBooks, then chase the driver on WhatsApp…",
  sample:
    "We copy every invoice PDF into the CRM by hand, then chase missing fields over email for days.",
  ctaLabel: "Get the engineered version, free, 48h",
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