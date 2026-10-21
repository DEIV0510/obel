import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { preload } from "react-dom";
import { sitio } from "@/config/sitio";
import { datosEstructurados, descripcionSitio, jsonLd, tituloSitio } from "@/lib/seo";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";
import { WhatsappFlotante } from "@/components/layout/WhatsappFlotante";
import { ObservadorRevelado } from "@/components/ui/ObservadorRevelado";
import "./globals.css";

/* Tipografías del portafolio de la marca: Archivo Black (títulos) e Inter (texto). */
const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const texto = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-texto",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitio.dominio || "http://localhost:3000"),
  title: {
    default: tituloSitio,
    template: `%s · ${sitio.marca}`,
  },
  description: descripcionSitio,
  applicationName: sitio.marca,
  keywords: [
    "consultoría empresarial",
    "consultoría en Cali",
    "formulación de proyectos",
    "gestión de proyectos",
    "planeación estratégica",
    "marketing y crecimiento comercial",
    "comunicación digital",
    "desarrollo organizacional",
  ],
  ...(sitio.dominio ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: sitio.marca,
    title: tituloSitio,
    description: descripcionSitio,
    ...(sitio.dominio ? { url: "/" } : {}),
  },
  twitter: {
    card: "summary_large_image",
    site: "@ObelColombia",
    title: tituloSitio,
    description: descripcionSitio,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "light",
};

/** Marca el documento como «con JavaScript» antes de pintar (evita saltos en el selector de perfiles). */
const SCRIPT_JS = `document.documentElement.setAttribute("data-js","")`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Máscaras del logotipo: se piden pronto para que aparezca con la primera pintura.
  // (Las máscaras CSS se piden en modo CORS: el preload debe coincidir.)
  preload("/marca/obel-logotipo.png", { as: "image", crossOrigin: "anonymous", fetchPriority: "high" });

  return (
    <html lang="es-CO" className={`${display.variable} ${texto.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_JS }} />
      </head>
      <body>
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <Cabecera />
        {children}
        <Pie />
        <WhatsappFlotante />
        <ObservadorRevelado />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(datosEstructurados()) }}
        />
      </body>
    </html>
  );
}
