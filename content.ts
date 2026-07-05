// Single place to edit site content that changes often.
// Add a case study = add one object to `workItems` (sample: true renders the "Sample" chip).

export const contact = {
  email: "hello@autovex.solutions", // TODO: real address
  bookingUrl: "#", // TODO: Cal.com / Calendly link
};

export const stack = ["n8n", "Next.js", "React Native", "OpenAI", "Supabase"];

export type WorkItem = {
  title: string;
  summary: string;
  metric: string;
  sample?: boolean;
  image?: string; // path under /public, falls back to striped placeholder
};

export const workItems: WorkItem[] = [
  {
    title: "Ops autopilot for a logistics firm",
    summary: "Order intake, invoicing and dispatch notifications — hands-free.",
    metric: "−34 hrs/week of manual work",
    sample: true,
  },
  {
    title: "Booking platform for a clinic chain",
    summary: "Web booking with automated reminders and no-show recovery.",
    metric: "2× online bookings in 60 days",
    sample: true,
  },
];

export const steps = [
  { title: "Map", body: "A short call and an audit of where your team's hours actually go." },
  { title: "Blueprint", body: "A fixed-scope plan with the expected return stated up front." },
  { title: "Build", body: "Shipped in weeks, with a working demo every Friday." },
  { title: "Run", body: "We monitor, maintain and keep improving what we ship." },
];
