"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { sitio } from "@/config/sitio";
import {
  LIMITES,
  ORDEN_CAMPOS,
  SERVICIOS_INTERES,
  TIPOS_ORGANIZACION,
  mensajeWhatsappSolicitud,
  normalizar,
  validar,
  validarCampo,
  type CampoSolicitud,
  type Errores,
  type Solicitud,
} from "@/lib/solicitud";
import { enlaceWhatsapp, mensajes, numeroVisible } from "@/lib/whatsapp";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Formulario.module.css";

type Estado = "inactivo" | "enviando" | "exito" | "no_configurado" | "error_envio" | "limite" | "rechazado";

const VACIA: Solicitud = {
  nombre: "",
  organizacion: "",
  correo: "",
  whatsapp: "",
  tipo: "",
  servicio: "",
  descripcion: "",
  autorizacion: false,
};

const MENSAJES_ESTADO: Partial<Record<Estado, string>> = {
  no_configurado:
    "El envío por formulario todavía no está habilitado en este sitio, así que tus datos no se enviaron. Puedes continuar por WhatsApp con la información que escribiste.",
  error_envio:
    "No pudimos confirmar el envío de tu solicitud. Intenta de nuevo en unos minutos o continúa por WhatsApp.",
  limite:
    "Recibimos varias solicitudes desde tu conexión en poco tiempo. Espera unos minutos antes de intentarlo de nuevo o continúa por WhatsApp.",
  rechazado:
    "No pudimos procesar la solicitud. Recarga la página e inténtalo de nuevo, o continúa por WhatsApp.",
};

const suscribirNada = () => () => {};

export function FormularioPrediagnostico() {
  const id = useId();
  const [valores, setValores] = useState<Solicitud>(VACIA);
  const [errores, setErrores] = useState<Errores>({});
  const [tocados, setTocados] = useState<Partial<Record<CampoSolicitud, boolean>>>({});
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [anuncio, setAnuncio] = useState("");
  const [vistaWhatsapp, setVistaWhatsapp] = useState(false);
  const trampa = useRef<HTMLInputElement>(null);
  const inicio = useRef(0);
  // Tras hidratar, la validación es propia; sin JavaScript actúa la nativa del navegador.
  const hidratado = useSyncExternalStore(suscribirNada, () => true, () => false);
  const formulario = useRef<HTMLFormElement>(null);
  const exito = useRef<HTMLHeadingElement>(null);
  const vista = useRef<HTMLDivElement>(null);
  const botonVista = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    inicio.current = performance.now();
  }, []);

  // Los botones «Solicitar prediagnóstico» de servicios y perfiles preseleccionan el formulario.
  useEffect(() => {
    const alHacerClic = (e: MouseEvent) => {
      const enlace = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-servicio], a[data-tipo]");
      if (!enlace) return;
      const { servicio, tipo } = enlace.dataset;
      setValores((v) => ({
        ...v,
        ...(servicio && SERVICIOS_INTERES.some((s) => s.valor === servicio) ? { servicio } : {}),
        ...(tipo && (TIPOS_ORGANIZACION as readonly string[]).includes(tipo) ? { tipo } : {}),
      }));
    };
    document.addEventListener("click", alHacerClic);
    return () => document.removeEventListener("click", alHacerClic);
  }, []);

  useEffect(() => {
    if (estado === "exito") exito.current?.focus();
  }, [estado]);

  useEffect(() => {
    if (vistaWhatsapp) vista.current?.focus();
  }, [vistaWhatsapp]);

  const actualizar = (campo: CampoSolicitud, valor: string | boolean) => {
    const nuevo = { ...valores, [campo]: valor };
    setValores(nuevo);
    if (tocados[campo] || errores[campo]) {
      setErrores((e) => ({ ...e, [campo]: validarCampo(campo, normalizar({ ...nuevo })) }));
    }
  };

  const alCambiar = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const campo = name as CampoSolicitud;
    actualizar(campo, type === "checkbox" ? (e.target as HTMLInputElement).checked : value);
  };

  const alSalir = (campo: CampoSolicitud) => {
    setTocados((t) => ({ ...t, [campo]: true }));
    setErrores((e) => ({ ...e, [campo]: validarCampo(campo, normalizar({ ...valores })) }));
  };

  const enfocarPrimerError = (errs: Errores) => {
    const primero = ORDEN_CAMPOS.find((c) => errs[c]);
    if (!primero) return;
    const el = formulario.current?.querySelector<HTMLElement>(`[name="${primero}"]`);
    el?.focus();
  };

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === "enviando") return;
    setVistaWhatsapp(false);

    const solicitud = normalizar({ ...valores });
    const errs = validar(solicitud);
    setErrores(errs);
    setTocados(Object.fromEntries(ORDEN_CAMPOS.map((c) => [c, true])));
    const cantidad = Object.keys(errs).length;
    if (cantidad > 0) {
      setAnuncio(
        cantidad === 1 ? "Hay un campo por corregir." : `Hay ${cantidad} campos por corregir.`,
      );
      enfocarPrimerError(errs);
      return;
    }

    setEstado("enviando");
    setAnuncio("Enviando tu solicitud…");
    try {
      const respuesta = await fetch("/api/prediagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...solicitud, sitio_web: trampa.current?.value ?? "", transcurrido: Math.round(performance.now() - inicio.current) }),
      });
      const datos = (await respuesta.json().catch(() => ({}))) as { ok?: boolean; codigo?: string; errores?: Errores };

      if (respuesta.ok && datos.ok && datos.codigo === "enviado") {
        setEstado("exito");
        setAnuncio("");
        return;
      }
      if (datos.codigo === "validacion" && datos.errores) {
        setErrores(datos.errores);
        setEstado("inactivo");
        setAnuncio("Revisa los campos marcados.");
        enfocarPrimerError(datos.errores);
        return;
      }
      const codigo = datos.codigo as Estado | undefined;
      setEstado(codigo && MENSAJES_ESTADO[codigo] ? codigo : "error_envio");
      setAnuncio("");
    } catch {
      setEstado("error_envio");
      setAnuncio("");
    }
  };

  const mensaje = mensajeWhatsappSolicitud(normalizar({ ...valores }), mensajes.prediagnostico);
  const describir = (campo: CampoSolicitud, ...extra: string[]) =>
    [errores[campo] ? `${id}-${campo}-error` : "", ...extra].filter(Boolean).join(" ") || undefined;

  if (estado === "exito") {
    return (
      <div className={styles.exito}>
        <span className={styles.exitoMarca} aria-hidden="true" />
        <h3 ref={exito} tabIndex={-1} className={styles.exitoTitulo}>
          Recibimos tu solicitud.
        </h3>
        <p>
          Tu solicitud de prediagnóstico fue enviada al equipo de OBEL Colombia. Usaremos los datos que compartiste para
          contactarte.
        </p>
        <a
          href={enlaceWhatsapp(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${boton.boton} ${boton.secundario}`}
        >
          <IconoWhatsapp />
          Escribir también por WhatsApp
          <span className="solo-lectores"> (abre WhatsApp)</span>
        </a>
      </div>
    );
  }

  const error = (campo: CampoSolicitud) =>
    errores[campo] ? (
      <p id={`${id}-${campo}-error`} className={styles.error}>
        <span aria-hidden="true" className={styles.errorIcono}>
          !
        </span>
        {errores[campo]}
      </p>
    ) : null;

  return (
    <form
      ref={formulario}
      className={styles.formulario}
      action="/api/prediagnostico"
      method="post"
      noValidate={hidratado}
      onSubmit={enviar}
      aria-describedby={`${id}-nota`}
    >
      <p id={`${id}-nota`} className={styles.nota}>
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="solo-lectores">asterisco</span> son obligatorios.
      </p>

      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-nombre`}>
            Nombre completo <span className={styles.req} aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-nombre`}
            name="nombre"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITES.nombre}
            value={valores.nombre}
            onChange={alCambiar}
            onBlur={() => alSalir("nombre")}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={describir("nombre")}
          />
          {error("nombre")}
        </div>

        <div className={styles.campo}>
          <label htmlFor={`${id}-organizacion`}>
            Organización <span className={styles.opcional}>(opcional)</span>
          </label>
          <input
            id={`${id}-organizacion`}
            name="organizacion"
            type="text"
            autoComplete="organization"
            maxLength={LIMITES.organizacion}
            value={valores.organizacion}
            onChange={alCambiar}
            onBlur={() => alSalir("organizacion")}
            aria-invalid={Boolean(errores.organizacion)}
            aria-describedby={describir("organizacion")}
          />
          {error("organizacion")}
        </div>
      </div>

      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-correo`}>
            Correo electrónico <span className={styles.req} aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-correo`}
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={LIMITES.correo}
            value={valores.correo}
            onChange={alCambiar}
            onBlur={() => alSalir("correo")}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={describir("correo")}
          />
          {error("correo")}
        </div>

        <div className={styles.campo}>
          <label htmlFor={`${id}-whatsapp`}>
            Número de WhatsApp <span className={styles.req} aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={LIMITES.whatsapp}
            placeholder="300 000 0000"
            value={valores.whatsapp}
            onChange={alCambiar}
            onBlur={() => alSalir("whatsapp")}
            aria-invalid={Boolean(errores.whatsapp)}
            aria-describedby={describir("whatsapp", `${id}-whatsapp-ayuda`)}
          />
          <p id={`${id}-whatsapp-ayuda`} className={styles.ayuda}>
            Si no es de Colombia, incluye el indicativo del país.
          </p>
          {error("whatsapp")}
        </div>
      </div>

      <fieldset
        className={styles.grupo}
        role="radiogroup"
        aria-labelledby={`${id}-tipo-leyenda`}
        aria-required="true"
        aria-invalid={Boolean(errores.tipo)}
        aria-describedby={describir("tipo")}
      >
        <legend id={`${id}-tipo-leyenda`}>
          Tipo de organización <span className={styles.req} aria-hidden="true">*</span>
        </legend>
        <div className={styles.opciones}>
          {TIPOS_ORGANIZACION.map((t) => (
            <label key={t} className={styles.opcion}>
              <input
                type="radio"
                name="tipo"
                value={t}
                required
                checked={valores.tipo === t}
                onChange={alCambiar}
                onBlur={() => alSalir("tipo")}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {error("tipo")}
      </fieldset>

      <div className={styles.campo}>
        <label htmlFor={`${id}-servicio`}>
          Servicio de interés <span className={styles.req} aria-hidden="true">*</span>
        </label>
        <div className={styles.selector}>
          <select
            id={`${id}-servicio`}
            name="servicio"
            required
            value={valores.servicio}
            onChange={alCambiar}
            onBlur={() => alSalir("servicio")}
            aria-invalid={Boolean(errores.servicio)}
            aria-describedby={describir("servicio")}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {SERVICIOS_INTERES.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.etiqueta}
              </option>
            ))}
          </select>
        </div>
        {error("servicio")}
      </div>

      <div className={styles.campo}>
        <label htmlFor={`${id}-descripcion`}>
          Describe brevemente tu necesidad <span className={styles.req} aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${id}-descripcion`}
          name="descripcion"
          rows={5}
          required
          minLength={LIMITES.descripcionMin}
          maxLength={LIMITES.descripcion}
          value={valores.descripcion}
          onChange={alCambiar}
          onBlur={() => alSalir("descripcion")}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby={describir("descripcion", `${id}-descripcion-ayuda`)}
        />
        <p id={`${id}-descripcion-ayuda`} className={styles.ayuda}>
          ¿Qué quieres desarrollar, en qué etapa está y qué te gustaría lograr? ({valores.descripcion.length}/
          {LIMITES.descripcion})
        </p>
        {error("descripcion")}
      </div>

      <div className={styles.autorizacion}>
        <label className={styles.casilla}>
          <input
            type="checkbox"
            name="autorizacion"
            value="si"
            required
            checked={valores.autorizacion}
            onChange={alCambiar}
            onBlur={() => alSalir("autorizacion")}
            aria-invalid={Boolean(errores.autorizacion)}
            aria-describedby={describir("autorizacion", `${id}-aviso-datos`)}
          />
          <span>
            Autorizo a OBEL Colombia a tratar mis datos personales para responder esta solicitud.
            {sitio.politicaDatosUrl ? (
              <>
                {" "}
                Consulta la <a href={sitio.politicaDatosUrl}>política de tratamiento de datos</a>.
              </>
            ) : null}
            <span className={styles.req} aria-hidden="true">
              {" *"}
            </span>
          </span>
        </label>
        <p id={`${id}-aviso-datos`} className={styles.ayuda}>
          Responsable: {sitio.marca} (WhatsApp {numeroVisible()}). Usamos tus datos para atender esta solicitud; puedes
          consultarlos, corregirlos, suprimirlos o revocar la autorización (Ley 1581 de 2012).
        </p>
        {error("autorizacion")}
      </div>

      {/* Trampa para bots: invisible y fuera del orden de tabulación */}
      <div className={styles.trampa} aria-hidden="true">
        <label htmlFor={`${id}-sitio`}>Deja este campo vacío</label>
        <input ref={trampa} id={`${id}-sitio`} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.envio}>
        <button type="submit" className={`${boton.boton} ${boton.primario} ${styles.enviar}`} disabled={estado === "enviando"}>
          {estado === "enviando" ? (
            <>
              <span className={styles.giro} aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              Solicitar mi prediagnóstico
              <IconoFlecha className={boton.flecha} />
            </>
          )}
        </button>
        <button
          type="button"
          className={`${boton.boton} ${boton.secundario}`}
          onClick={() => setVistaWhatsapp(true)}
          aria-expanded={vistaWhatsapp}
          aria-controls={`${id}-vista`}
          ref={botonVista}
        >
          <IconoWhatsapp />
          Prefiero continuar por WhatsApp
        </button>
      </div>

      <p className="solo-lectores" role="status" aria-live="polite">
        {anuncio}
      </p>

      {MENSAJES_ESTADO[estado] ? (
        <div className={styles.aviso} role="alert">
          <p>{MENSAJES_ESTADO[estado]}</p>
          {!vistaWhatsapp ? (
            <button type="button" className={boton.enlace} onClick={() => setVistaWhatsapp(true)}>
              Ver el mensaje para WhatsApp
              <IconoFlecha className={boton.flecha} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        id={`${id}-vista`}
        ref={vista}
        tabIndex={-1}
        className={styles.vista}
        hidden={!vistaWhatsapp}
        aria-labelledby={`${id}-vista-titulo`}
        role="region"
      >
        <p id={`${id}-vista-titulo`} className={styles.vistaTitulo}>
          Este es el mensaje que se abrirá en WhatsApp
        </p>
        <pre className={styles.mensaje}>{mensaje}</pre>
        <p className={styles.ayuda}>
          Revisa la información antes de continuar: nada se envía hasta que confirmes el mensaje dentro de WhatsApp.
        </p>
        <div className={styles.vistaAcciones}>
          <a
            href={enlaceWhatsapp(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${boton.boton} ${boton.primario}`}
          >
            <IconoWhatsapp />
            Abrir WhatsApp con este mensaje
            <span className="solo-lectores"> (abre WhatsApp)</span>
          </a>
          <button
            type="button"
            className={boton.enlace}
            onClick={() => {
              setVistaWhatsapp(false);
              botonVista.current?.focus();
            }}
          >
            Volver al formulario
          </button>
        </div>
      </div>
    </form>
  );
}
