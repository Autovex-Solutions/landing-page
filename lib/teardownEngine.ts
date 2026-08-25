// Keyword-heuristic pipeline sketch builder, used by the teardown lead
// capture card (components/TeardownCard.tsx). Used to also back the
// desktop self-running demo (TeardownSketch.tsx, deleted) so the two
// couldn't drift.
// Fully client-side; the real LLM-backed engine is PLAN_pipeline-engine.md.

export type SkNode = { label: string; kind: "trigger" | "step" | "done" };
export type Row = SkNode | [SkNode, SkNode]; // pair = parallel branch
export type Sketch = { rows: Row[]; perWeek: number };

const TRIGGERS: [RegExp, string][] = [
  [/invoice|billing|receipt/i, "Invoice arrives"],
  [/order|purchase/i, "New order lands"],
  [/lead|enquir|inquir|form/i, "New lead comes in"],
  [/book|appointment|schedul/i, "Booking request arrives"],
  [/email|inbox|message|whatsapp|dm\b/i, "Message hits the inbox"],
];

const STEPS: [RegExp, string][] = [
  [/pdf|scan|extract|retype|re-?type|copy|paste|data entry|spreadsheet|sheet|excel/i, "Extract & enter the data"],
  [/crm|hubspot|salesforce|pipedrive/i, "Update the CRM"],
  [/invoice|quickbooks|xero|billing/i, "Generate & send the invoice"],
  [/chase|remind|follow.?up|no.?show|late|overdue/i, "Chase it automatically"],
  [/schedul|calendar|book|appointment/i, "Schedule & confirm"],
  [/reply|respond|answer|draft/i, "Draft the reply"],
  [/report|summar|dashboard|kpi/i, "Compile the report"],
  [/dispatch|shipping|deliver|driver|inventory|stock/i, "Sync ops & notify dispatch"],
  [/approv|review|sign.?off/i, "Route for approval"],
  [/whatsapp|slack|telegram|sms|text/i, "Route & answer messages"],
];

export function buildSketch(text: string): Sketch {
  const trigger = TRIGGERS.find(([re]) => re.test(text))?.[1] ?? "The work shows up";
  const steps = STEPS.filter(([re]) => re.test(text))
    .map(([, label]) => label)
    .slice(0, 4);
  if (steps.length === 0) steps.push("Extract the busywork", "Process & validate", "Update your tools");
  const volume = /daily|every day|each|hundreds|dozens|constant|all day|hours/i.test(text) ? 6 : 0;
  const perWeek = 3 + steps.length * 4 + volume;
  return {
    rows: [
      { label: trigger, kind: "trigger" },
      ...steps.map((label) => ({ label, kind: "step" as const })),
      { label: "Done — team notified, nothing retyped", kind: "done" },
    ],
    perWeek,
  };
}

export function monthlyHours(sketch: Sketch): number {
  return Math.round(sketch.perWeek * 4.3);
}
