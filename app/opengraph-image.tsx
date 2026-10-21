import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "OBEL Colombia — De las ideas a los proyectos que generan resultados. Consultoría en Santiago de Cali.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fuente = readFile(join(process.cwd(), "assets/fuentes/ArchivoBlack-Regular.ttf"));
const logotipo = readFile(join(process.cwd(), "public/marca/obel-logotipo-blanco.png"));

/** Ruta O (misma geometría del diagrama de la portada) en los cuatro colores. */
const rutaO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="470" height="470">
<g fill="none" stroke-width="9">
<path d="M200 20A180 180 0 0 0 20 200" stroke="#01398e"/>
<path d="M20 200A180 180 0 0 0 200 380" stroke="#065730"/>
<path d="M200 380A180 180 0 0 0 380 200" stroke="#db1010"/>
<path d="M380 200V60A40 40 0 0 0 340 20H200" stroke="#f2c94c"/>
</g>
<circle cx="200" cy="200" r="108" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="2" stroke-dasharray="4 8"/>
</svg>`;

export default async function Imagen() {
  const [archivo, logo] = await Promise.all([fuente, logotipo]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const rutaSrc = `data:image/svg+xml;base64,${Buffer.from(rutaO).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Archivo Black",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rutaSrc} width={470} height={470} alt="" style={{ position: "absolute", right: 48, top: 72 }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px", width: 760 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={194} height={60} alt="" />
          <div style={{ display: "flex", marginTop: 70, fontSize: 64, lineHeight: 1.02, letterSpacing: -1.5 }}>
            De las ideas a los proyectos que generan resultados.
          </div>
          <div style={{ display: "flex", marginTop: 38, fontSize: 22, color: "#a2a1a8", letterSpacing: 1.5 }}>
            CONSULTORÍA · SANTIAGO DE CALI, COLOMBIA
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, display: "flex" }}>
          <div style={{ flex: 1, background: "#01398e" }} />
          <div style={{ flex: 1, background: "#065730" }} />
          <div style={{ flex: 1, background: "#db1010" }} />
          <div style={{ flex: 1, background: "#f2c94c" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo Black", data: archivo, style: "normal", weight: 400 }],
    },
  );
}
