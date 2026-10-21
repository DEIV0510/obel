/**
 * Entrega de solicitudes de prediagnóstico (solo servidor).
 *
 * Canales disponibles, activados con variables de entorno (ver .env.example):
 *   1. Correo con Resend      RESEND_API_KEY + CONTACTO_CORREO_DESTINO + CONTACTO_CORREO_REMITENTE
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

function variable(nombre: string): string {
  return process.env[nombre]?.trim() ?? "";
}

export function canalesConfigurados() {
  return {
    correo: Boolean(
      variable("RESEND_API_KEY") && variable("CONTACTO_CORREO_DESTINO") && variable("CONTACTO_CORREO_REMITENTE"),
    ),
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
        from: variable("CONTACTO_CORREO_REMITENTE"),
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
    // Solo el estado: nunca se registran los datos personales.
    console.error(`[prediagnostico] Resend respondió ${respuesta.status}`);
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
