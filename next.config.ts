import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical-host redirects: every domain variant 301s to
  // https://www.autovexsolutions.com so search engines see ONE address.
  // A host rule only fires when that domain actually points at this
  // deployment — attach every variant to the Vercel project for it to work.
  async redirects() {
    return [
      // apex → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "autovexsolutions.com" }],
        destination: "https://www.autovexsolutions.com/:path*",
        permanent: true,
      },
      // legacy/alternate domain, if attached
      {
        source: "/:path*",
        has: [{ type: "host", value: "autovex.solutions" }],
        destination: "https://www.autovexsolutions.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.autovex.solutions" }],
        destination: "https://www.autovexsolutions.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
