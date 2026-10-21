"use client";

/** Último recurso si falla el diseño raíz: HTML mínimo con estilos en línea. */
export default function ErrorGlobal({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="es-CO">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <title>OBEL Colombia</title>
        <div style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.1 }}>No pudimos cargar el sitio.</h1>
          <p style={{ color: "#a2a1a8" }}>Intenta de nuevo en unos segundos.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1rem",
              padding: "0.9rem 1.4rem",
              border: 0,
              borderRadius: "999px 6px 999px 999px",
              background: "#f2c94c",
              color: "#0a0a0a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
