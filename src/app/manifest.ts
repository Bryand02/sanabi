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
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
    ],
  };
}
