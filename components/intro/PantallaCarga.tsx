import type { CSSProperties } from "react";
import medidas from "@/lib/marca-medidas.json";
import { ScriptEnLinea } from "@/components/ui/ScriptEnLinea";
import styles from "./PantallaCarga.module.css";

/**
 * Lógica de la pantalla de carga, en un script en línea que no depende del
 * paquete de React (si este falla, la pantalla igual se retira):
 *  - No aparece si ya se vio en esta sesión, con «reducir movimiento», con
 *    ahorro de datos ni en conexiones lentas (ahí el contenido va primero).
 *  - Se retira en cuanto el documento y las fuentes están listos, con un
 *    mínimo de 700 ms para que la secuencia de marca no parpadee.
 *  - Tope absoluto de 1,8 s, pase lo que pase con la red.
 *  - El CSS tiene además un retiro de emergencia a los 4 s.
 */
const SCRIPT = `(function(){
var el=document.getElementById("intro");if(!el)return;
var visto,reducir=false,lenta=false;try{visto=sessionStorage.getItem("obel-intro")}catch(e){visto="1"}
try{reducir=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
try{var c=navigator.connection;lenta=!!(c&&(c.saveData||/(^|-)(2g|3g)$/.test(c.effectiveType||"")))}catch(e){}
if(visto||reducir||lenta)return;
el.setAttribute("data-estado","cargando");
var t0=Date.now(),hecho=false;
function salir(){if(hecho)return;hecho=true;el.setAttribute("data-estado","saliendo");
try{sessionStorage.setItem("obel-intro","1")}catch(e){}
setTimeout(function(){el.setAttribute("data-estado","listo")},650);}
setTimeout(salir,1800);
function listo(){setTimeout(salir,Math.max(0,700-(Date.now()-t0)))}
function fuentes(){try{(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(listo,listo)}catch(e){listo()}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fuentes);else fuentes();
})();`;

export function PantallaCarga() {
  const estilo = {
    "--fin-o": medidas.finO,
    "--cx": `${(medidas.centroO.x * 100).toFixed(2)}%`,
    "--cy": `${(medidas.centroO.y * 100).toFixed(2)}%`,
  } as CSSProperties;

  return (
    <>
      <div id="intro" className={styles.intro} style={estilo} aria-hidden="true" suppressHydrationWarning>
        <div className={styles.centro}>
          <div className={styles.logo}>
            <span className={styles.o}>
              <span className={styles.trazo} />
            </span>
            <span className={styles.resto}>
              <span className={styles.letras} />
            </span>
          </div>
          <span className={styles.pais}>Colombia</span>
          <span className={styles.progreso} />
        </div>
      </div>
      <ScriptEnLinea html={SCRIPT} />
    </>
  );
}
