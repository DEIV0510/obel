import { sitio } from "@/config/sitio";
import { servicios } from "@/content/servicios";
import { enlaceMapa } from "@/lib/seo";
import { enlaceWhatsapp, mensajes, numeroVisible } from "@/lib/whatsapp";
import { Logotipo } from "@/components/marca/Logotipo";
import { IconoWhatsapp, iconosRed } from "@/components/ui/Iconos";
import { ScriptEnLinea } from "@/components/ui/ScriptEnLinea";
import boton from "@/components/ui/Boton.module.css";
import { enlacesNav } from "./navegacion";
import styles from "./Pie.module.css";

export function Pie() {
  const redes = sitio.redes.filter((r) => r.url);
  const anio = new Date().getFullYear();

  return (
    <footer className={styles.pie} data-tema="oscuro">
      <div className="filete-marca" aria-hidden="true" />
      <div className={`contenedor ${styles.reticula}`}>
        <div className={styles.marca}>
          <Logotipo etiqueta="OBEL Colombia" className={styles.logo} />
          <p className={styles.nombre}>{sitio.marca}</p>
          <p className={styles.descripcion}>{sitio.descripcion}</p>
          <a
            href={enlaceWhatsapp(mensajes.general)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${boton.boton} ${boton.primario}`}
          >
            <IconoWhatsapp />
            Habla con un consultor
            <span className="solo-lectores"> (abre WhatsApp)</span>
          </a>
        </div>

        <nav className={styles.columna} aria-label="Navegación del pie">
          <h2 className={styles.titulo}>Navegación</h2>
          <ul role="list" className={styles.lista}>
            {enlacesNav.map((e) => (
              <li key={e.id}>
                <a href={e.href}>{e.texto}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.columna}>
          <h2 className={styles.titulo}>Servicios</h2>
          <ul role="list" className={styles.lista}>
            {servicios.map((s) => (
              <li key={s.id}>
                <a href={`/#servicio-${s.id}`}>{s.titulo}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.columna}>
          <h2 className={styles.titulo}>Contacto</h2>
          <address className={styles.direccion}>
            <a href={enlaceMapa()} target="_blank" rel="noopener noreferrer">
              {sitio.direccion.calle}
              <br />
              Barrio {sitio.direccion.barrio}
              <br />
              {sitio.direccion.ciudad}, {sitio.direccion.pais}
              <span className="solo-lectores"> (abre Google Maps)</span>
            </a>
            <a href={enlaceWhatsapp(mensajes.general)} target="_blank" rel="noopener noreferrer">
              WhatsApp {numeroVisible()}
              <span className="solo-lectores"> (abre WhatsApp)</span>
            </a>
          </address>

          {redes.length > 0 ? (
            <ul role="list" className={styles.redes} aria-label="Redes sociales">
              {redes.map((r) => {
                const Icono = iconosRed[r.red];
                return (
                  <li key={r.red}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.nombre} de OBEL Colombia (${r.usuario})`}>
                      <Icono />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={`contenedor ${styles.legal}`}>
        <p>
          ©{" "}
          <span id="anio-pie" suppressHydrationWarning>
            {anio}
          </span>{" "}
          {sitio.marca}. Todos los derechos reservados.
          {/* La página es estática: el año se actualiza en el navegador */}
          <ScriptEnLinea html={`document.getElementById("anio-pie").textContent=new Date().getFullYear()`} />
        </p>
        <p className={styles.legalDerecha}>
          {sitio.politicaDatosUrl ? <a href={sitio.politicaDatosUrl}>Política de tratamiento de datos</a> : null}
          <span>
            {sitio.direccion.ciudad}, {sitio.direccion.pais}
          </span>
        </p>
      </div>
    </footer>
  );
}
