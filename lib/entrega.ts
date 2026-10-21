/**
 * Entrega de solicitudes de prediagnóstico (solo servidor).
 *
 * Canales disponibles, activados con variables de entorno (ver .env.example):
 *   1. Correo con Resend      RESEND_API_KEY + CONTACTO_CORREO_DESTINO
 *                             (+ CONTACTO_CORREO_REMITENTE de un dominio verificado)
 *   2. Webhook (CRM, Make,
 *      Zapier, Apps Script…)  FORMULARIO_WEBHOOK_URL (+ FORMULARIO_WEBHOOK_SECRETO opcional)
 *
 * Si no hay ningún canal configurado, la solicitud NO se da por recibida: la
 * API responde «no_configurado» y el sitio ofrece continuar por WhatsApp.
 * Las claves nunca llegan al navegador (no llevan el prefijo NEXT_PUBLIC_).
 */
import { etiquetaServicio, type Solicitud } from "@/lib/solicitud";

export type ResultadoEntrega = "enviado" | "no_configurado" | "error";

const TIEMPO_MAXIMO_MS = 8000;

/**
 * Remitente de prueba de Resend. Funciona sin dominio propio, pero solo
 * entrega en el correo con el que se creó la cuenta de Resend: sirve mientras
 * CONTACTO_CORREO_DESTINO sea ese mismo correo.
 */
const REMITENTE_DE_PRUEBA = "OBEL Colombia <onboarding@resend.dev>";

/** Pistas para los registros de Vercel según la respuesta de Resend. */
const PISTAS_RESEND: Record<number, string> = {
  401: "RESEND_API_KEY no es válida o fue revocada.",
  403: "Resend no autoriza el remitente: verifica el dominio de CONTACTO_CORREO_REMITENTE o, con el remitente de prueba, usa como destino el correo de la cuenta de Resend.",
  422: "Resend rechazó los datos del mensaje (revisa el formato de CONTACTO_CORREO_DESTINO y CONTACTO_CORREO_REMITENTE).",
  429: "Se superó el límite de envíos de Resend.",
};

function variable(nombre: string): string {
  return process.env[nombre]?.trim() ?? "";
}

export function canalesConfigurados() {
  return {
    correo: Boolean(variable("RESEND_API_KEY") && variable("CONTACTO_CORREO_DESTINO")),
    webhook: Boolean(variable("FORMULARIO_WEBHOOK_URL")),
  };
}

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function filas(s: Solicitud): [string, string][] {
  return [
    ["Nombre", s.nombre],
    ["Organización", s.organizacion || "—"],
    ["Correo", s.correo],
    ["WhatsApp", s.whatsapp],
    ["Tipo de organización", s.tipo],
    ["Servicio de interés", etiquetaServicio(s.servicio)],
    ["Autorizó el tratamiento de datos", s.autorizacion ? "Sí" : "No"],
  ];
}

async function enviarCorreo(s: Solicitud, fecha: string): Promise<boolean> {
  const destino = variable("CONTACTO_CORREO_DESTINO")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const texto = [
    "Nueva solicitud de prediagnóstico desde el sitio web de OBEL Colombia.",
    "",
    ...filas(s).map(([k, v]) => `${k}: ${v}`),
    "",
    "Necesidad:",
    s.descripcion,
    "",
    `Recibida: ${fecha}`,
  ].join("\n");

  const html = `<!doctype html><html lang="es"><body style="font-family:Arial,sans-serif;color:#0a0a0a">
<h2 style="margin:0 0 16px">Nueva solicitud de prediagnóstico</h2>
<table cellpadding="6" style="border-collapse:collapse">${filas(s)
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="border-bottom:1px solid #ddd">${escaparHtml(k)}</th><td style="border-bottom:1px solid #ddd">${escaparHtml(v)}</td></tr>`,
    )
    .join("")}</table>
<h3 style="margin:24px 0 8px">Necesidad</h3>
<p style="white-space:pre-wrap;margin:0">${escaparHtml(s.descripcion)}</p>
<p style="color:#666;font-size:12px;margin-top:24px">Recibida: ${escaparHtml(fecha)} · Sitio web OBEL Colombia</p>
</body></html>`;

  const enviar = (conRespuesta: boolean) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${variable("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
        "User-Agent": "obel-colombia-web/1.0",
      },
      body: JSON.stringify({
        from: variable("CONTACTO_CORREO_REMITENTE") || REMITENTE_DE_PRUEBA,
        to: destino,
        ...(conRespuesta ? { reply_to: s.correo } : {}),
        subject: `Prediagnóstico: ${s.nombre}${s.organizacion ? ` · ${s.organizacion}` : ""}`,
        text: texto,
        html,
      }),
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
    });

  let respuesta = await enviar(true);
  // Si Resend rechaza los datos (p. ej. el reply_to), se reintenta una vez sin
  // él: el correo de la persona sigue en el cuerpo y la solicitud no se pierde.
  if (respuesta.status === 422 || respuesta.status === 400) respuesta = await enviar(false);

  if (!respuesta.ok) {
    // Solo el estado, el tipo de error y una pista: nunca los datos personales.
    const error = (await respuesta.json().catch(() => ({}))) as { name?: unknown };
    const tipo = typeof error.name === "string" ? ` (${error.name})` : "";
    const pista = PISTAS_RESEND[respuesta.status] ?? "";
    console.error(`[prediagnostico] Resend respondió ${respuesta.status}${tipo}. ${pista}`.trim());
  }
  return respuesta.ok;
}

async function enviarWebhook(s: Solicitud, fecha: string): Promise<boolean> {
  const secreto = variable("FORMULARIO_WEBHOOK_SECRETO");
  const respuesta = await fetch(variable("FORMULARIO_WEBHOOK_URL"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secreto ? { "X-Obel-Secreto": secreto } : {}),
    },
    body: JSON.stringify({
      origen: "sitio-web-obel",
      evento: "prediagnostico",
      recibida: fecha,
      ...s,
      servicioEtiqueta: etiquetaServicio(s.servicio),
    }),
    signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
  });
  if (!respuesta.ok) console.error(`[prediagnostico] El webhook respondió ${respuesta.status}`);
  return respuesta.ok;
}

/** Envía la solicitud por los canales configurados; basta con que uno confirme. */
export async function entregarSolicitud(s: Solicitud): Promise<ResultadoEntrega> {
  const canales = canalesConfigurados();
  if (!canales.correo && !canales.webhook) return "no_configurado";

  const fecha = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
  const intentos: Promise<boolean>[] = [];
  if (canales.correo) intentos.push(enviarCorreo(s, fecha));
  if (canales.webhook) intentos.push(enviarWebhook(s, fecha));

  const resultados = await Promise.allSettled(intentos);
  for (const r of resultados) {
    if (r.status === "rejected") {
      console.error("[prediagnostico] Error de red al entregar la solicitud:", r.reason instanceof Error ? r.reason.name : "desconocido");
    }
  }
  return resultados.some((r) => r.status === "fulfilled" && r.value) ? "enviado" : "error";
}
