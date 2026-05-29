import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanabi Kids",
    short_name: "Sanabi Kids",
    description: "Moda infantil con identidad, color y confianza.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9f4",
    theme_color: "#ff8f7d",
    lang: "es-CO",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
