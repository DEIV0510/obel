# OBEL Colombia — sitio web

Sitio institucional y de conversión de **OBEL Colombia**, firma consultora de Santiago de Cali
(formulación y gestión de proyectos, planeación estratégica, marketing y comunicación digital).

- **Stack:** Next.js 16.4 (App Router, Turbopack) · React 19 · TypeScript · CSS Modules (sin Tailwind ni librerías de animación).
- **Página:** una sola página estática (`/`) más la API del formulario y páginas de estado.
- **Identidad:** colores muestreados del portafolio 2026 (negro, papel `#F3F1F3` y los cuatro colores del marco de la portada), tipografías del portafolio (Archivo Black + Inter), logotipo original sin redibujar.

## Ejecutar en local

Requisitos: Node.js 20.9 o superior (las pruebas unitarias usan Node 22.6+).

```bash
npm install
npm run dev          # http://localhost:3000
```

Otros comandos:

```bash
npm run lint         # ESLint
npm run typecheck    # tipos de rutas + TypeScript
npm test             # pruebas (las de la API se ejecutan si hay un servidor en BASE_URL)
npm run build        # compilación de producción
npm start            # servir la compilación
npm run assets       # regenerar logotipos, favicon e iconos desde assets/originales
```

Para probar la API contra un servidor en otro puerto: `BASE_URL=http://localhost:3000 npm test`.

## Estructura

```
app/                  layout, página, API (/api/prediagnostico), SEO (sitemap, robots, manifest, imagen OG)
components/
  inicio/             secciones de la portada (Hero, Propuesta, Servicios, Metodología, Sectores, Nosotros, Equipo, Conversión, Preguntas)
  contacto/           sección y formulario de prediagnóstico
  layout/             cabecera, menú móvil, pie y botón flotante de WhatsApp
  intro/              pantalla de carga
  marca/              logotipo (archivo original usado como máscara)
  ui/                 botones, iconos propios, observador de apariciones
config/sitio.ts       datos de la empresa (dirección, WhatsApp, redes, política de datos)
content/              todos los textos (servicios, sectores, equipo, institucional, preguntas)
lib/                  WhatsApp, SEO/JSON-LD, validación del formulario, envío
assets/originales/    copias exactas de los archivos de marca entregados (no se modifican)
assets/equipo/        fotografías originales del equipo
scripts/              generación de recursos de marca con sharp
tests/                pruebas con node:test
```

## Formulario de prediagnóstico

El formulario valida en el navegador **y** en el servidor (`app/api/prediagnostico/route.ts`), con
trampa para bots, control de origen, límite por IP y tamaño máximo. Funciona también sin JavaScript.

**Nunca simula un envío:** si no hay un canal configurado responde `no_configurado`, avisa a la
persona que sus datos no se enviaron y le ofrece continuar por WhatsApp mostrando antes el mensaje
exacto que se abrirá.

Para activarlo, define en Vercel (o en `.env.local`) al menos un canal — ver `.env.example`:

| Canal | Variables |
| --- | --- |
| Correo con [Resend](https://resend.com) | `RESEND_API_KEY`, `CONTACTO_CORREO_DESTINO`, `CONTACTO_CORREO_REMITENTE` (dominio verificado en Resend) |
| Webhook (CRM, Google Apps Script, Make, Zapier…) | `FORMULARIO_WEBHOOK_URL` y, opcional, `FORMULARIO_WEBHOOK_SECRETO` |

Ninguna clave lleva el prefijo `NEXT_PUBLIC_`, así que nunca llegan al navegador.

## WhatsApp

Número oficial `+57 315 464 3733`, normalizado a `573154643733` en `lib/whatsapp.ts`. Cada contexto
(general, cada servicio, prediagnóstico y cada tipo de organización) abre `https://wa.me/…` con su
mensaje codificado. WhatsApp nunca se abre de forma automática.

## Desplegar en Vercel

1. Importa el repositorio `DEIV0510/obel` en Vercel (framework detectado: Next.js; comando `next build`; sin directorio de salida personalizado).
2. Variables de entorno: `NEXT_PUBLIC_SITE_URL` con el dominio definitivo (si se omite, se usa el dominio de producción de Vercel) y las del canal del formulario.
3. Despliega. Las cabeceras de seguridad (CSP, HSTS, etc.) se aplican desde `next.config.ts` en producción.

## Pendientes antes de publicar

- [ ] **Política de tratamiento de datos personales** (Ley 1581 de 2012): no existe una página validada. El formulario pide autorización sin enlace; cuando exista, pega su URL en `config/sitio.ts → politicaDatosUrl` y aparecerá en el formulario y en el pie.
- [ ] **Canal de envío del formulario**: configurar Resend o un webhook (ver arriba). Mientras tanto, el formulario deriva honestamente a WhatsApp.
- [ ] **LinkedIn**: no se pudo verificar la URL exacta de @ObelColombia (LinkedIn bloquea las consultas sin sesión). Cuando se confirme, pégala en `config/sitio.ts`.
- [ ] **Dominio**: definir `NEXT_PUBLIC_SITE_URL` para canonical, sitemap y datos estructurados con el dominio propio.
- [ ] **Foto de Xiomara Belalcázar**: se tomó del portafolio (432 × 592 px) porque no venía como archivo aparte; conviene reemplazarla por el original en alta resolución en `assets/equipo/xiomara-belalcazar.jpg`.
- [ ] Confirmar con la empresa que el equipo publicado (cuatro personas del portafolio 2026) está vigente.

## Fuentes del contenido

Todos los textos provienen del brief del sitio, del **Portafolio de servicios 2026** y del **Resumen
ejecutivo** entregados por la empresa (historia, misión, visión, valores, objetivos, equipo). No se
publican cifras, clientes, testimonios, precios ni plazos. La ruta de trabajo de cuatro etapas es una
forma de comunicar el acompañamiento, no una metodología certificada.
