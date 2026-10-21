import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { preload } from "react-dom";
import { sitio } from "@/config/sitio";
import { datosEstructurados, descripcionSitio, jsonLd, openGraphBase, tituloSitio } from "@/lib/seo";
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
  // Sin dominio, Next usa su propio respaldo (y avisa en la compilación).
  ...(sitio.dominio ? { metadataBase: new URL(sitio.dominio) } : {}),
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
  openGraph: openGraphBase,
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

/**
 * Marca el documento como «con JavaScript» antes de pintar (evita saltos en
 * el selector de perfiles). Si React no llega a hidratar en 8 s (paquete que
 * no cargó, navegador antiguo), se retira para volver al modo sin JavaScript.
 */
const SCRIPT_JS = `(function(){var r=document.documentElement;r.setAttribute("data-js","");setTimeout(function(){if(!window.__obelHidratado)r.removeAttribute("data-js")},8000)})()`;

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
