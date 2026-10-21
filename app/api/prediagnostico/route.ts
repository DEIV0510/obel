import { NextResponse } from "next/server";
import { entregarSolicitud } from "@/lib/entrega";
import { normalizar, validar } from "@/lib/solicitud";

/**
 * Recibe solicitudes de prediagnóstico.
 *
 * - JSON (formulario con JavaScript): responde { ok, codigo, errores? }.
 * - application/x-www-form-urlencoded (navegador sin JavaScript): redirige
 *   con 303 a una página de resultado.
 *
 * Códigos: enviado · validacion · no_configurado · error_envio · limite · rechazado
 */

const TAMANO_MAXIMO = 16 * 1024;
const VENTANA_MS = 10 * 60 * 1000;
const MAXIMO_POR_VENTANA = 5;
/** Un humano tarda más que esto en completar el formulario. */
const TIEMPO_MINIMO_MS = 2500;

// Límite por IP en memoria: protección básica por instancia (en Vercel cada
// instancia tiene su propio contador). Para tráfico alto, usar un almacén
// compartido (p. ej. Upstash) o la protección contra bots de la plataforma.
const registro = new Map<string, number[]>();

function excedeLimite(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (registro.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  registro.set(ip, recientes);
  if (registro.size > 5000) {
    for (const [clave, tiempos] of registro) {
      if (tiempos.every((t) => ahora - t >= VENTANA_MS)) registro.delete(clave);
    }
  }
  return recientes.length > MAXIMO_POR_VENTANA;
}

function ipCliente(request: Request): string {
  const reenviada = request.headers.get("x-forwarded-for");
  return reenviada?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "desconocida";
}

/** Rechaza envíos desde otros sitios (CSRF): el origen debe coincidir con el host. */
function origenValido(request: Request): boolean {
  const origen = request.headers.get("origin");
  if (!origen) return true; // algunos navegadores no lo envían en formularios del mismo sitio
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

type Codigo = "enviado" | "validacion" | "no_configurado" | "error_envio" | "limite" | "rechazado";

const ESTADO_HTTP: Record<Codigo, number> = {
  enviado: 200,
  validacion: 422,
  no_configurado: 503,
  error_envio: 502,
  limite: 429,
  rechazado: 400,
};

export async function POST(request: Request) {
  const tipoContenido = request.headers.get("content-type") ?? "";
  const esFormulario =
    tipoContenido.includes("application/x-www-form-urlencoded") || tipoContenido.includes("multipart/form-data");

  const responder = (codigo: Codigo, extra: Record<string, unknown> = {}) => {
    if (esFormulario) {
      const destino = codigo === "enviado" ? "/solicitud/recibida" : `/solicitud/no-enviada?motivo=${codigo}`;
      return NextResponse.redirect(new URL(destino, request.url), 303);
    }
    return NextResponse.json({ ok: codigo === "enviado", codigo, ...extra }, { status: ESTADO_HTTP[codigo] });
  };

  if (!origenValido(request)) return responder("rechazado");

  const longitud = Number(request.headers.get("content-length") ?? 0);
  if (longitud > TAMANO_MAXIMO) return responder("rechazado");

  let entrada: Record<string, unknown>;
  try {
    if (esFormulario) {
      const datos = await request.formData();
      entrada = Object.fromEntries([...datos.entries()].filter(([, v]) => typeof v === "string"));
    } else {
      const cuerpo = await request.text();
      if (cuerpo.length > TAMANO_MAXIMO) return responder("rechazado");
      const json: unknown = JSON.parse(cuerpo);
      if (!json || typeof json !== "object" || Array.isArray(json)) return responder("rechazado");
      entrada = json as Record<string, unknown>;
    }
  } catch {
    return responder("rechazado");
  }

  // Trampa para bots: campo oculto que una persona nunca completa.
  if (typeof entrada.sitio_web === "string" && entrada.sitio_web.trim() !== "") return responder("rechazado");

  const inicio = Number(entrada.inicio);
  if (Number.isFinite(inicio) && inicio > 0 && Date.now() - inicio < TIEMPO_MINIMO_MS) {
    return responder("rechazado");
  }

  if (excedeLimite(ipCliente(request))) return responder("limite");

  const solicitud = normalizar(entrada);
  const errores = validar(solicitud);
  if (Object.keys(errores).length > 0) return responder("validacion", { errores });

  try {
    const resultado = await entregarSolicitud(solicitud);
    if (resultado === "enviado") return responder("enviado");
    if (resultado === "no_configurado") return responder("no_configurado");
    return responder("error_envio");
  } catch {
    console.error("[prediagnostico] Fallo inesperado al entregar la solicitud");
    return responder("error_envio");
  }
}
