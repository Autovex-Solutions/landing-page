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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${plexMono.variable}`}>
        {children}
        <Effects />
      </body>
    </html>
  );
}
