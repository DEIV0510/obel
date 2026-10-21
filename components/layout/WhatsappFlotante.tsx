"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import { IconoWhatsapp } from "@/components/ui/Iconos";
import styles from "./WhatsappFlotante.module.css";

/**
 * Acceso flotante y discreto a WhatsApp. Solo aparece después de la portada
 * (que ya tiene sus llamadas a la acción) y se retira mientras se ven el
 * formulario o el pie, para no tapar campos ni enlaces. Nunca abre WhatsApp
 * por sí solo.
 */
export function WhatsappFlotante() {
  const [visible, setVisible] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    let pasoPortada = false;
    let zonasOcultas = 0;
    const estados = new Map<Element, boolean>();
    const recalcular = () => setVisible(pasoPortada && zonasOcultas === 0);

    const portada = document.getElementById("inicio");
    const zonas = [document.getElementById("contacto"), document.querySelector("footer")].filter(
      (x): x is HTMLElement => Boolean(x),
    );

    const observadorPortada = new IntersectionObserver(([e]) => {
      pasoPortada = !e.isIntersecting && e.boundingClientRect.top < 0;
      recalcular();
    });
    const observadorZonas = new IntersectionObserver((entradas) => {
      for (const e of entradas) estados.set(e.target, e.isIntersecting);
      zonasOcultas = [...estados.values()].filter(Boolean).length;
      recalcular();
    });

    if (portada) observadorPortada.observe(portada);
    else pasoPortada = true;
    zonas.forEach((z) => observadorZonas.observe(z));
    recalcular();

    return () => {
      observadorPortada.disconnect();
      observadorZonas.disconnect();
    };
  }, [ruta]);

  return (
    <a
      href={enlaceWhatsapp(mensajes.general)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.flotante}
      data-visible={visible ? "true" : undefined}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
    >
      <IconoWhatsapp tamano={26} />
      <span className={styles.etiqueta}>Habla con un consultor</span>
      <span className="solo-lectores"> por WhatsApp (abre WhatsApp)</span>
    </a>
  );
}
