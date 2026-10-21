// Pruebas de integración de /api/prediagnostico contra un servidor en marcha.
// Uso: BASE_URL=http://localhost:3000 npm test   (se omiten si no hay servidor)
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const disponible = await fetch(BASE, { method: "HEAD" }).then(
  () => true,
  () => false,
);
const opciones = { skip: disponible ? false : `sin servidor en ${BASE}` };

const valida = {
  nombre: "Prueba Automatizada",
  organizacion: "",
  correo: "prueba@example.com",
  whatsapp: "3001234567",
  tipo: "Empresa",
  servicio: "planeacion",
  descripcion: "Mensaje de prueba automatizada con suficiente contexto.",
  autorizacion: true,
  inicio: 1,
};

const enviar = (cuerpo, cabeceras = {}) =>
  fetch(`${BASE}/api/prediagnostico`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": `10.0.0.${Math.floor(Math.random() * 250)}`, ...cabeceras },
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });

test("datos inválidos → 422 con errores por campo", opciones, async () => {
  const r = await enviar({ ...valida, correo: "x" });
  assert.equal(r.status, 422);
  const d = await r.json();
  assert.equal(d.ok, false);
  assert.equal(d.codigo, "validacion");
  assert.ok(d.errores.correo);
});

test("JSON mal formado → 400", opciones, async () => {
  const r = await enviar("{no es json");
  assert.equal(r.status, 400);
});

test("trampa para bots → 400 y nunca «enviado»", opciones, async () => {
  const r = await enviar({ ...valida, sitio_web: "spam" });
  assert.equal(r.status, 400);
  assert.equal((await r.json()).ok, false);
});

test("envío más rápido que una persona → 400", opciones, async () => {
  const r = await enviar({ ...valida, transcurrido: 300 });
  assert.equal(r.status, 400);
});

test("tipo de contenido no admitido → 415", opciones, async () => {
  const r = await fetch(`${BASE}/api/prediagnostico`, { method: "POST", headers: { "Content-Type": "text/plain" }, body: "hola" });
  assert.equal(r.status, 415);
});

test("cuerpo demasiado grande → 400", opciones, async () => {
  const r = await enviar({ ...valida, descripcion: "x".repeat(20000) });
  assert.equal(r.status, 400);
});

test("otro origen (CSRF) → 400", opciones, async () => {
  const r = await enviar(valida, { Origin: "https://sitio-ajeno.example" });
  assert.equal(r.status, 400);
});

test("sin canal configurado no se simula el envío", opciones, async () => {
  const r = await enviar(valida);
  const d = await r.json();
  if (r.status === 200) {
    assert.equal(d.codigo, "enviado"); // hay un canal real configurado
  } else {
    assert.equal(r.status, 503);
    assert.equal(d.ok, false);
    assert.equal(d.codigo, "no_configurado");
  }
});

test("formulario sin JavaScript → redirección 303", opciones, async () => {
  const cuerpo = new URLSearchParams({ ...valida, autorizacion: "si", correo: "x" });
  const r = await fetch(`${BASE}/api/prediagnostico`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Forwarded-For": "10.0.1.1" },
    body: cuerpo,
    redirect: "manual",
  });
  assert.equal(r.status, 303);
  assert.match(r.headers.get("location") ?? "", /\/solicitud\/no-enviada\?motivo=validacion$/);
});
