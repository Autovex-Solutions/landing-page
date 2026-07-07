import type { SimpleIcon } from "simple-icons";
import {
  siAirtable,
  siClaude,
  siGmail,
  siGoogledrive,
  siGooglesheets,
  siHubspot,
  siMailchimp,
  siN8n,
  siNotion,
  siQuickbooks,
  siShopify,
  siStripe,
  siTelegram,
  siWhatsapp,
  siZapier,
} from "simple-icons";

// Floating app-icon tiles behind the CTA — the tools we wire together,
// drifting around the booking button. Hand-placed scatter: tiles hug the
// left/right thirds so the centered copy stays clear. First 8 entries are
// the outermost tiles — mobile shows only those (see globals.css).
type Tile = {
  icon: SimpleIcon;
  left: string;
  top: string;
  size: number;
  blur?: number;
  opacity: number;
  dur: number; // bob duration (s); negative delay starts each tile mid-phase
  delay: number;
  accent?: boolean;
};

const TILES: Tile[] = [
  { icon: siGmail, left: "6%", top: "16%", size: 58, opacity: 0.8, dur: 9, delay: -2 },
  { icon: siTelegram, left: "88%", top: "20%", size: 56, opacity: 0.8, dur: 10, delay: -5 },
  { icon: siNotion, left: "4%", top: "72%", size: 66, blur: 3, opacity: 0.5, dur: 8, delay: -1 },
  { icon: siQuickbooks, left: "82%", top: "66%", size: 62, blur: 3, opacity: 0.5, dur: 8.5, delay: -4 },
  { icon: siHubspot, left: "17%", top: "8%", size: 42, blur: 2, opacity: 0.5, dur: 13, delay: -7 },
  { icon: siGoogledrive, left: "86%", top: "86%", size: 40, blur: 2, opacity: 0.5, dur: 13.5, delay: -3 },
  { icon: siN8n, left: "22%", top: "32%", size: 52, opacity: 0.9, dur: 10, delay: -6, accent: true },
  { icon: siClaude, left: "76%", top: "38%", size: 50, opacity: 0.9, dur: 9, delay: -2.5, accent: true },
  { icon: siWhatsapp, left: "13%", top: "58%", size: 44, blur: 1, opacity: 0.6, dur: 11, delay: -8 },
  { icon: siGooglesheets, left: "10%", top: "36%", size: 38, blur: 2, opacity: 0.55, dur: 12, delay: -4.5 },
  { icon: siStripe, left: "26%", top: "76%", size: 46, blur: 1, opacity: 0.6, dur: 9.5, delay: -1.5 },
  { icon: siShopify, left: "93%", top: "50%", size: 44, blur: 2, opacity: 0.55, dur: 12, delay: -6.5 },
  { icon: siAirtable, left: "70%", top: "10%", size: 44, blur: 1, opacity: 0.6, dur: 11.5, delay: -3.5 },
  { icon: siZapier, left: "68%", top: "80%", size: 46, blur: 1, opacity: 0.6, dur: 10.5, delay: -7.5 },
  { icon: siMailchimp, left: "64%", top: "5%", size: 38, blur: 2, opacity: 0.45, dur: 12.5, delay: -5.5 },
];

export default function CtaIconField() {
  return (
    <div className="icon-field" aria-hidden="true">
      {TILES.map((t, i) => (
        <span
          key={i}
          className={`tile${t.accent ? " accent" : ""}`}
          style={{
            left: t.left,
            top: t.top,
            width: t.size,
            height: t.size,
            filter: t.blur ? `blur(${t.blur}px)` : undefined,
            opacity: t.opacity,
            animationDuration: `${t.dur}s`,
            animationDelay: `${t.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d={t.icon.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}
