import type { SimpleIcon } from "simple-icons";
import {
  siN8n,
  siNextdotjs,
  siReact,
  siClaude,
  siSupabase,
  siGmail,
  siGooglesheets,
  siQuickbooks,
  siHubspot,
  siNotion,
  siStripe,
  siWhatsapp,
  siAirtable,
  siTelegram,
  siShopify,
  siZapier,
  siGoogledrive,
  siGooglecalendar,
  siMailchimp,
  siXero,
} from "simple-icons";

// Build stack first, then the integrations we wire into. Monochrome marks —
// icons inherit currentColor so the row stays inside the brand palette.
const TOOLS: [string, SimpleIcon][] = [
  ["n8n", siN8n],
  ["Next.js", siNextdotjs],
  ["React Native", siReact],
  ["Claude", siClaude],
  ["Supabase", siSupabase],
  ["Gmail", siGmail],
  ["Google Sheets", siGooglesheets],
  ["QuickBooks", siQuickbooks],
  ["HubSpot", siHubspot],
  ["Notion", siNotion],
  ["Stripe", siStripe],
  ["WhatsApp", siWhatsapp],
  ["Airtable", siAirtable],
  ["Telegram", siTelegram],
  ["Shopify", siShopify],
  ["Zapier", siZapier],
  ["Google Drive", siGoogledrive],
  ["Google Calendar", siGooglecalendar],
  ["Mailchimp", siMailchimp],
  ["Xero", siXero],
];

// Server component — the scroll is a CSS animation, zero client JS.
export default function ToolMarquee() {
  return (
    <>
      <span className="sr-only">{TOOLS.map(([name]) => name).join(", ")}</span>
      <div className="tools" aria-hidden="true">
        <div className="tools-track">
          {/* row rendered twice so translateX(-50%) loops seamlessly */}
          {[...TOOLS, ...TOOLS].map(([name, icon], i) => (
            <span className="tool" key={i}>
              <svg viewBox="0 0 24 24">
                <path d={icon.path} />
              </svg>
              {name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
