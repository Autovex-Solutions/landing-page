import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autovex Solutions",
    short_name: "Autovex",
    description:
      "AI automation, custom software, web platforms and mobile apps — shipped in weeks.",
    start_url: "/",
    display: "browser",
    background_color: "#0b0c0e",
    theme_color: "#0b0c0e",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
