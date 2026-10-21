/**
 * Genera los recursos de marca optimizados a partir de los archivos
 * ORIGINALES de assets/originales (copias exactas de la carpeta OBEL que
 * entregó la empresa; nunca se modifican).
 *
 * El logotipo no se redibuja ni se vectoriza: solo se convierte el fondo en
 * transparencia (la luminancia del original pasa a ser el canal alfa), se
 * recorta el margen vacío y se exporta en negro y en blanco. La geometría
 * de cada píxel se conserva.
 *
 *   obel-logotipo-negro-original.png   logotipo negro sobre blanco (1.png)
 *   obel-simbolo-blanco-original.png   símbolo blanco sobre negro (3.png)
 *
 * Salidas:
 *   public/marca/obel-logotipo.png         negro con transparencia (máscara CSS y fondos claros)
 *   public/marca/obel-logotipo-blanco.png  blanco con transparencia (fondos oscuros)
 *   public/marca/obel-simbolo.png          símbolo negro con transparencia
 *   public/marca/obel-simbolo-blanco.png   símbolo blanco con transparencia
 *   public/marca/icon-192.png, icon-512.png, icon-maskable-512.png   manifest
 *   app/icon.png, app/apple-icon.png, app/favicon.ico                 iconos
 *   lib/marca-medidas.json                 proporciones del logotipo (pantalla de carga)
 *
 * Uso: npm run assets
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const ORIG = "assets/originales";
const LOGO = `${ORIG}/obel-logotipo-negro-original.png`;
const SIMBOLO = `${ORIG}/obel-simbolo-blanco-original.png`;
const NEGRO = { r: 0, g: 0, b: 0, alpha: 1 };

await mkdir("public/marca", { recursive: true });

/** Canal alfa a partir de la luminancia (invertida si la figura es oscura). */
async function alfaDesde(archivo, figuraOscura) {
  const { data, info } = await sharp(archivo)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alfa = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < alfa.length; i++) {
    const v = data[i * info.channels];
    alfa[i] = figuraOscura ? 255 - v : v;
  }
  return { alfa, width: info.width, height: info.height };
}

/** Caja que contiene la figura (alfa > umbral). */
function caja({ alfa, width, height }, umbral = 24) {
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alfa[y * width + x] > umbral) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1, y1 };
}

/** Recorta con un margen y devuelve una imagen RGBA del color pedido. */
async function figura(fuente, c, margen, color, anchoFinal) {
  const left = Math.max(0, c.x0 - margen);
  const top = Math.max(0, c.y0 - margen);
  const width = Math.min(fuente.width - left, c.x1 - c.x0 + 1 + margen * 2);
  const height = Math.min(fuente.height - top, c.y1 - c.y0 + 1 + margen * 2);
  const alfa = await sharp(fuente.alfa, { raw: { width: fuente.width, height: fuente.height, channels: 1 } })
    .extract({ left, top, width, height })
    .extractChannel(0) // sharp devuelve sRGB de 3 canales si no se pide uno solo
    .raw()
    .toBuffer();
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = color;
    rgba[i * 4 + 1] = color;
    rgba[i * 4 + 2] = color;
    rgba[i * 4 + 3] = alfa[i];
  }
  let img = sharp(rgba, { raw: { width, height, channels: 4 } });
  if (anchoFinal) img = img.resize({ width: anchoFinal, kernel: "lanczos3" });
  return { img, width, height, left, top };
}

/* ── 1. Logotipo ─────────────────────────────────────────── */
const logo = await alfaDesde(LOGO, true);
const cLogo = caja(logo);
const margenLogo = 6;

for (const [nombre, color] of [["obel-logotipo", 0], ["obel-logotipo-blanco", 255]]) {
  const { img } = await figura(logo, cLogo, margenLogo, color, 800);
  await img.png({ compressionLevel: 9, palette: true, colors: 64 }).toFile(`public/marca/${nombre}.png`);
}

// Columna vacía entre la «O» y la «B»: permite revelar la O por separado en
// la pantalla de carga usando la misma imagen (alineación exacta).
const anchoLogo = cLogo.x1 - cLogo.x0 + 1 + margenLogo * 2;
const altoLogo = cLogo.y1 - cLogo.y0 + 1 + margenLogo * 2;
let finO = null;
let enHueco = false;
for (let x = cLogo.x0 + 20; x < cLogo.x1; x++) {
  let ocupada = false;
  for (let y = cLogo.y0; y <= cLogo.y1; y++) {
    if (logo.alfa[y * logo.width + x] > 24) { ocupada = true; break; }
  }
  if (!ocupada && !enHueco) { finO = x; enHueco = true; }
  if (ocupada && enHueco) { finO = Math.round((finO + x) / 2); break; }
}
// Centro del contraforma de la O (agujero): punto medio del hueco vertical interior.
const xCentroO = Math.round((cLogo.x0 + finO) / 2) - 8;
let yIni = null, yFin = null;
for (let y = cLogo.y0; y <= cLogo.y1; y++) {
  const dentro = logo.alfa[y * logo.width + xCentroO] <= 24;
  if (dentro && yIni === null && y > cLogo.y0 + 10) yIni = y;
  if (!dentro && yIni !== null && yFin === null && y > yIni + 10) yFin = y;
}
const medidas = {
  relacion: +(anchoLogo / altoLogo).toFixed(4),
  /** Fracción del ancho que ocupa la O (incluido el margen izquierdo). */
  finO: +((finO - cLogo.x0 + margenLogo) / anchoLogo).toFixed(4),
  /** Centro de la O, en fracciones del ancho y del alto. */
  centroO: {
    x: +((xCentroO - cLogo.x0 + margenLogo) / anchoLogo).toFixed(4),
    y: +((((yIni ?? cLogo.y0) + (yFin ?? cLogo.y1)) / 2 - cLogo.y0 + margenLogo) / altoLogo).toFixed(4),
  },
};
await writeFile("lib/marca-medidas.json", JSON.stringify(medidas, null, 2) + "\n");

/* ── 2. Símbolo ──────────────────────────────────────────── */
const simbolo = await alfaDesde(SIMBOLO, false);
const cSimbolo = caja(simbolo);
for (const [nombre, color] of [["obel-simbolo", 0], ["obel-simbolo-blanco", 255]]) {
  const { img } = await figura(simbolo, cSimbolo, 4, color, 480);
  await img.png({ compressionLevel: 9, palette: true, colors: 64 }).toFile(`public/marca/${nombre}.png`);
}

/* ── 3. Iconos: símbolo blanco sobre negro (versión 3.png del kit) ── */
async function icono(size, relleno = 0.18) {
  const interior = Math.round(size * (1 - relleno * 2));
  const { img } = await figura(simbolo, cSimbolo, 0, 255, null);
  const s = await img
    .resize({ width: interior, height: interior, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: NEGRO } })
    .composite([{ input: s, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await writeFile("app/icon.png", await icono(512, 0.16));
await writeFile("app/apple-icon.png", await icono(180, 0.18));
await writeFile("public/marca/icon-192.png", await icono(192, 0.16));
await writeFile("public/marca/icon-512.png", await icono(512, 0.16));
await writeFile("public/marca/icon-maskable-512.png", await icono(512, 0.26));

// favicon.ico con PNG embebidos (16, 32, 48): formato ICO estándar.
const tamanos = [16, 32, 48];
const pngs = await Promise.all(tamanos.map((s) => icono(s, 0.1)));
const cabecera = Buffer.alloc(6);
cabecera.writeUInt16LE(0, 0);
cabecera.writeUInt16LE(1, 2);
cabecera.writeUInt16LE(tamanos.length, 4);
let desplazamiento = 6 + 16 * tamanos.length;
const entradas = tamanos.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(desplazamiento, 12);
  desplazamiento += pngs[i].length;
  return e;
});
await writeFile("app/favicon.ico", Buffer.concat([cabecera, ...entradas, ...pngs]));

console.log("Recursos de marca generados.", medidas);
