import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sitio.marca,
    short_name: sitio.marcaCorta,
    description: sitio.descripcion,
    lang: "es-CO",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/marca/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/marca/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
