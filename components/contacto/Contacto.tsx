import { sitio } from "@/config/sitio";
import { direccionCompleta, enlaceMapa } from "@/lib/seo";
import { enlaceWhatsapp, mensajes, numeroVisible } from "@/lib/whatsapp";
import { IconoUbicacion, IconoWhatsapp, iconosRed } from "@/components/ui/Iconos";
import { FormularioPrediagnostico } from "./FormularioPrediagnostico";
import styles from "./Contacto.module.css";

export function Contacto() {
  const redes = sitio.redes.filter((r) => r.url);
  return (
    <section id="contacto" data-nav="contacto" className={`seccion ${styles.contacto}`} aria-labelledby="contacto-titulo">
      <div className={`contenedor ${styles.reticula}`}>
        <div className={styles.info}>
          <p className="antetitulo">Prediagnóstico</p>
          <h2 id="contacto-titulo" className="titulo-seccion">
            Cuéntanos qué quieres desarrollar.
          </h2>
          <p className="lead">
            Con esta información preparamos una primera conversación sobre tu necesidad y los posibles siguientes pasos.
          </p>

          <ul role="list" className={styles.canales}>
            <li>
              <a href={enlaceWhatsapp(mensajes.prediagnostico)} target="_blank" rel="noopener noreferrer">
                <span className={styles.icono}>
                  <IconoWhatsapp />
                </span>
                <span>
                  <span className={styles.canalNombre}>Habla con un consultor</span>
                  <span className={styles.canalDato}>WhatsApp {numeroVisible()}</span>
                </span>
                <span className="solo-lectores"> (abre WhatsApp)</span>
              </a>
            </li>
            <li>
              <a href={enlaceMapa()} target="_blank" rel="noopener noreferrer">
                <span className={styles.icono}>
                  <IconoUbicacion />
                </span>
                <span>
                  <span className={styles.canalNombre}>Sede en {sitio.direccion.ciudad}</span>
                  <span className={styles.canalDato}>{direccionCompleta()}</span>
                </span>
                <span className="solo-lectores"> (abre Google Maps)</span>
              </a>
            </li>
          </ul>

          {redes.length > 0 ? (
            <div className={styles.redes}>
              <p className={styles.redesTitulo}>Síguenos · @ObelColombia</p>
              <ul role="list">
                {redes.map((r) => {
                  const Icono = iconosRed[r.red];
                  return (
                    <li key={r.red}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.nombre} de OBEL Colombia`}>
                        <Icono />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className={styles.panel}>
          <FormularioPrediagnostico />
        </div>
      </div>
    </section>
  );
}
