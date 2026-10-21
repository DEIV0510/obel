// Pruebas de la validación compartida del formulario (Node ≥ 22.6 ejecuta TS sin compilar).
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, validar, mensajeWhatsappSolicitud, etiquetaServicio } from "../lib/solicitud.ts";

const valida = {
  nombre: "  Ana   María Pérez ",
  organizacion: "Fundación Ejemplo",
  correo: "Ana@Ejemplo.org ",
  whatsapp: "+57 300 123 4567",
  tipo: "ONG",
  servicio: "formulacion",
  descripcion: "Queremos formular un proyecto productivo con marco lógico para presentarlo a cooperación.",
  autorizacion: true,
};

test("normaliza espacios y el correo", () => {
  const s = normalizar(valida);
  assert.equal(s.nombre, "Ana María Pérez");
  assert.equal(s.correo, "ana@ejemplo.org");
  assert.equal(s.autorizacion, true);
});

test("una solicitud completa no tiene errores", () => {
  assert.deepEqual(validar(normalizar(valida)), {});
});

test("exige los campos obligatorios", () => {
  const errores = validar(normalizar({}));
  for (const campo of ["nombre", "correo", "whatsapp", "tipo", "servicio", "descripcion", "autorizacion"]) {
    assert.ok(errores[campo], `falta el error de ${campo}`);
  }
  assert.equal(errores.organizacion, undefined, "la organización es opcional");
});

test("rechaza correos y teléfonos inválidos", () => {
  const e = validar(normalizar({ ...valida, correo: "ana@", whatsapp: "12ab" }));
  assert.ok(e.correo);
  assert.ok(e.whatsapp);
});

test("solo acepta tipos y servicios de la lista", () => {
  const e = validar(normalizar({ ...valida, tipo: "Banco", servicio: "seo" }));
  assert.ok(e.tipo);
  assert.ok(e.servicio);
});

test("la autorización acepta el valor del formulario sin JavaScript", () => {
  assert.equal(normalizar({ ...valida, autorizacion: "si" }).autorizacion, true);
  assert.equal(normalizar({ ...valida, autorizacion: "false" }).autorizacion, false);
});

test("elimina caracteres de control", () => {
  assert.equal(normalizar({ ...valida, nombre: "Ana\u0000\u0007 Pérez" }).nombre, "Ana Pérez");
});

test("el mensaje de WhatsApp incluye solo lo que la persona escribió", () => {
  const m = mensajeWhatsappSolicitud(normalizar({ ...valida, organizacion: "" }));
  assert.match(m, /^Hola, quisiera solicitar un prediagnóstico inicial con OBEL Colombia\./);
  assert.match(m, /Servicio de interés: Formulación y gestión de proyectos/);
  assert.doesNotMatch(m, /Organización:/);
  assert.doesNotMatch(m, /\+57 300/, "no repite el número desde el que ya escribe");
});

test("etiquetas de servicio", () => {
  assert.equal(etiquetaServicio("orientacion"), "No estoy seguro; necesito orientación");
});
