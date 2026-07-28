import { ImageResponse } from "next/og";

/*
 * Generated Open Graph image (1200×630) for link previews on WhatsApp,
 * LinkedIn, X, Slack, iMessage etc. Built at compile time — no asset file
 * to maintain. Twitter reuses this via summary_large_image.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Autovex Solutions — AI automation, web and mobile app development. The busywork ends here.";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #101114 0%, #0b0c0e 60%, #08090a 100%)",
          color: "#f2f1ee",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "absolute",
            top: 64,
            left: 80,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#f2a33c",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 5, color: "#9b9d9f" }}>
            AUTOVEX SOLUTIONS
          </div>
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -3,
            marginBottom: 34,
          }}
        >
          The busywork ends here.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 34, color: "#f2a33c" }}>
            Automation · Web · Mobile
          </div>
          <div style={{ fontSize: 34, color: "#6a6c6f" }}>
            — Innovate. Automate. Elevate.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
