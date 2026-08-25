import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Effects from "@/components/Effects";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const SITE_URL = "https://www.autovexsolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Autovex Solutions — AI Automation, Web & Mobile App Development Agency",
    template: "%s | Autovex Solutions",
  },
  description:
    "Autovex Solutions builds AI-powered business automation, custom software, web platforms and mobile apps that cut manual work — fixed scope, shipped in weeks. Book a free 20-minute call.",
  keywords: [
    "AI automation agency",
    "business process automation",
    "workflow automation",
    "AI chatbot development",
    "custom software development",
    "web development agency",
    "mobile app development",
    "React Native app development",
    "Next.js development",
    "n8n automation",
    "UI/UX design",
    "Autovex Solutions",
  ],
  applicationName: "Autovex Solutions",
  authors: [{ name: "Autovex Solutions", url: SITE_URL }],
  creator: "Autovex Solutions",
  publisher: "Autovex Solutions",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "dTvJB4Kljmb0wrbgtcEEsWGJDhHSESL0Wjjsx5psd4c",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Autovex Solutions",
    locale: "en_US",
    title:
      "Autovex Solutions — AI Automation, Web & Mobile App Development Agency",
    description:
      "AI-powered automation, custom software, web platforms and mobile apps that take repetitive work off your team's plate — shipped in weeks, not quarters.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autovex Solutions — AI Automation, Web & Mobile Apps",
    description:
      "AI-powered automation, custom software, web and mobile apps — fixed scope, shipped in weeks. Innovate. Automate. Elevate.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: "Autovex Solutions",
      legalName: "Autovex Solutions",
      alternateName: "Autovex",
      slogan: "Innovate. Automate. Elevate.",
      url: SITE_URL,
      logo: `${SITE_URL}/logo-mark-white.png`,
      image: `${SITE_URL}/logo-lockup-white.png`,
      email: "autovexsolutions@gmail.com",
      telephone: "+92-348-2033984",
      description:
        "Autovex Solutions is a technology company helping businesses modernize, automate and scale through intelligent software — AI automations, custom software, web platforms, mobile apps and UI/UX design.",
      founder: [
        {
          "@type": "Person",
          name: "Huzaifa",
          email: "huzaifa@autovexsolutions.com",
        },
        {
          "@type": "Person",
          name: "Sudais",
          email: "sudais@autovexsolutions.com",
        },
        {
          "@type": "Person",
          name: "Ishaq",
          email: "ishaq@autovexsolutions.com",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "autovexsolutions@gmail.com",
        telephone: "+92-348-2033984",
        url: `${SITE_URL}/#contact`,
      },
      sameAs: [
        "https://www.linkedin.com/company/autovex-solutions/",
        "https://www.instagram.com/autovex_solutions/",
        "https://github.com/Autovex-Solutions",
        "https://wa.me/923482033984",
      ],
      knowsAbout: [
        "n8n",
        "Next.js",
        "React Native",
        "OpenAI",
        "Supabase",
        "Stripe",
        "Zapier",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Automations",
              description:
                "Custom AI-powered workflows, chatbots and process automation that eliminate repetitive manual work.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom Software Development",
              description:
                "Tailored software built around each client's business logic, from internal tools to enterprise platforms.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web Development",
              description:
                "Modern, responsive, high-performance websites and web applications built to convert.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mobile App Development",
              description:
                "Native and cross-platform iOS and Android apps designed for speed and reliability.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "UI/UX Design",
              description:
                "User-centered design — wireframes, prototypes and polished interfaces that keep users engaged.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Autovex Solutions",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Autovex Solutions — AI Automation, Web & Mobile App Development Agency",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {children}

        <Effects />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}