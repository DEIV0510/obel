"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Logotipo } from "@/components/marca/Logotipo";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import { enlaceWhatsapp, mensajes, numeroVisible } from "@/lib/whatsapp";
import { enlacesNav } from "./navegacion";
import styles from "./Cabecera.module.css";

/**
 * Cabecera fija. Se adapta al tema de la sección que pasa por debajo
 * (logotipo negro sobre claro, blanco sobre oscuro), marca la sección activa
 * y en móvil abre un menú a pantalla completa con foco atrapado.
 */
export function Cabecera() {
  const [desplazada, setDesplazada] = useState(false);
  const [oscura, setOscura] = useState(false);
  const [activo, setActivo] = useState<string>("inicio");
  const [abierto, setAbierto] = useState(false);
  const enInicio = usePathname() === "/";
  // En la portada, anclas locales; desde otras páginas, vuelven al inicio.
  const ruta = (hash: string) => (enInicio ? hash : `/${hash}`);
  // La sección activa solo tiene sentido en la portada.
  const actual = (id: string) => (enInicio && activo === id ? "true" : undefined);

  const cabeceraRef = useRef<HTMLElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tema bajo la cabecera y sección activa (un solo cálculo por fotograma).
  useEffect(() => {
    let fotograma = 0;
    const medir = () => {
      fotograma = 0;
      setDesplazada(window.scrollY > 8);
      const alto = cabeceraRef.current?.offsetHeight ?? 72;
      const sondaTema = alto / 2;
      const sondaNav = window.innerHeight * 0.35;
      let temaOscuro = false;
      let nav: string | null = null;
      for (const zona of document.querySelectorAll<HTMLElement>("main section[id], footer")) {
        const r = zona.getBoundingClientRect();
        if (r.top <= sondaTema && r.bottom > sondaTema) temaOscuro = zona.dataset.tema === "oscuro";
        if (r.top <= sondaNav && r.bottom > sondaNav && zona.dataset.nav) nav = zona.dataset.nav;
      }
      setOscura(temaOscuro);
      if (nav) setActivo(nav);
    };
    const programar = () => {
      if (!fotograma) fotograma = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    return () => {
      cancelAnimationFrame(fotograma);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
    };
  }, []);

  const cerrar = useCallback((devolverFoco: boolean) => {
    document.documentElement.style.removeProperty("overflow");
    setAbierto(false);
    if (devolverFoco) botonRef.current?.focus();
  }, []);

  // Menú móvil: bloqueo del desplazamiento, foco atrapado y tecla Escape.
  useEffect(() => {
    if (!abierto) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";

    // Todo lo que no es la cabecera ni el menú queda inerte: los lectores de
    // pantalla solo recorren el menú y el botón de cerrar (que vive en la cabecera).
    const fuera = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.tagName !== "SCRIPT" && el !== cabeceraRef.current && el !== panelRef.current,
    );
    const yaInertes = new Set(fuera.filter((el) => el.inert));
    fuera.forEach((el) => (el.inert = true));

    const enfocables = () => [
      botonRef.current,
      ...(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
    ].filter((x): x is HTMLElement => Boolean(x));

    enfocables()[1]?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar(true);
        return;
      }
      if (e.key !== "Tab") return;
      const lista = enfocables();
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    const escritorio = window.matchMedia("(min-width: 64rem)");
    const alCambiar = () => {
      if (escritorio.matches) cerrar(false);
    };

    document.addEventListener("keydown", alTeclear);
    escritorio.addEventListener("change", alCambiar);
    return () => {
      html.style.removeProperty("overflow");
      fuera.forEach((el) => {
        if (!yaInertes.has(el)) el.inert = false;
      });
      document.removeEventListener("keydown", alTeclear);
      escritorio.removeEventListener("change", alCambiar);
    };
  }, [abierto, cerrar]);

  const tema = abierto || oscura ? "oscuro" : undefined;

  return (
    <>
      <header
        ref={cabeceraRef}
        className={styles.cabecera}
        data-tema={tema}
        data-desplazada={desplazada && !abierto ? "true" : undefined}
        data-menu={abierto ? "true" : undefined}
      >
        <div className={`contenedor ${styles.barra}`}>
          <a
            href={ruta("#inicio")}
            className={styles.marca}
            aria-label="OBEL Colombia, ir al inicio"
            onClick={() => abierto && cerrar(false)}
          >
            <Logotipo className={styles.logo} />
          </a>

          <nav className={styles.nav} aria-label="Principal">
            <ul role="list">
              {enlacesNav.map((e) => (
                <li key={e.id}>
                  <a href={ruta(e.hash)} aria-current={actual(e.id)}>
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.acciones}>
            <a
              href={ruta("#contacto")}
              className={`${boton.boton} ${boton.primario} ${boton.compacto} ${styles.cta}`}
              onClick={() => abierto && cerrar(false)}
            >
              <span className={styles.ctaLargo}>Agenda tu prediagnóstico</span>
              <span className={styles.ctaCorto} aria-hidden="true">
                Prediagnóstico
              </span>
            </a>
            <button
              ref={botonRef}
              type="button"
              className={styles.alternar}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => (abierto ? cerrar(true) : setAbierto(true))}
            >
              <span className={styles.lineas} aria-hidden="true" />
            </button>
          </div>
        </div>
        <span className={styles.progreso} aria-hidden="true" />
      </header>

      <div
        id="menu-movil"
        ref={panelRef}
        className={styles.panel}
        data-tema="oscuro"
        data-abierto={abierto ? "true" : undefined}
        role="dialog"
        aria-label="Menú principal"
        inert={!abierto}
      >
        <div className={`contenedor ${styles.panelContenido}`}>
          <nav aria-label="Principal (móvil)">
            <ol role="list" className={styles.panelLista}>
              {enlacesNav.map((e, i) => (
                <li key={e.id} style={{ "--i": i } as React.CSSProperties}>
                  <a href={ruta(e.hash)} onClick={() => cerrar(false)} aria-current={actual(e.id)}>
                    <span className={styles.panelNumero}>{String(i + 1).padStart(2, "0")}</span>
                    {e.texto}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.panelAcciones}>
            <a
              href={ruta("#contacto")}
              onClick={() => cerrar(false)}
              className={`${boton.boton} ${boton.primario} ${boton.ancho}`}
            >
              Agenda tu prediagnóstico
              <IconoFlecha className={boton.flecha} />
            </a>
            <a
              href={enlaceWhatsapp(mensajes.general)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${boton.boton} ${boton.secundario} ${boton.ancho}`}
            >
              <IconoWhatsapp />
              Habla con un consultor
              <span className="solo-lectores"> (abre WhatsApp)</span>
            </a>
            <p className={styles.panelDato}>WhatsApp {numeroVisible()} · Santiago de Cali</p>
          </div>
        </div>
      </div>
    </>
  );
}
