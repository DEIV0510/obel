"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __obelHidratado?: boolean;
  }
}

/**
 * Activa las apariciones al desplazarse ([data-revelar]). Se activa solo
 * después de hidratar: sin JavaScript, o si este falla, todo el contenido se
 * ve desde el principio. Lo que ya está en pantalla se muestra sin animar.
 * Se vuelve a ejecutar en cada cambio de ruta (navegación sin recarga).
 */
export function ObservadorRevelado() {
  const ruta = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.setAttribute("data-js", "");
    window.__obelHidratado = true;

    const elementos = [...document.querySelectorAll<HTMLElement>("[data-revelar]:not([data-visible])")];
    if (!elementos.length || !("IntersectionObserver" in window)) return;

    const alto = window.innerHeight;
    for (const el of elementos) {
      const r = el.getBoundingClientRect();
      if (r.top < alto && r.bottom > 0) el.setAttribute("data-visible", "");
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-visible", "");
            observador.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    for (const el of elementos) if (!el.hasAttribute("data-visible")) observador.observe(el);
    raiz.setAttribute("data-revelar", "activo");

    return () => {
      observador.disconnect();
      raiz.removeAttribute("data-revelar");
    };
  }, [ruta]);

  return null;
}
