import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Effects from "@/components/Effects";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Autovex Solutions — Automation, Web & Mobile",
  description:
    "Autovex builds automation pipelines, web platforms and mobile apps that take repetitive work off your team's plate — shipped in weeks, not quarters.",
};

// Structured data so search engines and AI assistants can classify the agency.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Autovex Solutions",
  url: "https://autovex.solutions",
  email: "hello@autovex.solutions",
  description: metadata.description,
  serviceType: ["Business process automation", "Web development", "Mobile app development"],
  knowsAbout: ["n8n", "Next.js", "React Native", "OpenAI", "Supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // font variables live on <html> so :root tokens (--sans/--mono) can resolve them
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Effects />
      </body>
    </html>
  );
}
