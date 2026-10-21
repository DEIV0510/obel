/** Navegación principal. Rutas absolutas para que funcionen desde cualquier página. */
export const enlacesNav = [
  { id: "inicio", hash: "#inicio", href: "/#inicio", texto: "Inicio" },
  { id: "nosotros", hash: "#nosotros", href: "/#nosotros", texto: "Nosotros" },
  { id: "servicios", hash: "#servicios", href: "/#servicios", texto: "Servicios" },
  { id: "metodologia", hash: "#metodologia", href: "/#metodologia", texto: "Metodología" },
  { id: "contacto", hash: "#contacto", href: "/#contacto", texto: "Contacto" },
] as const;

export type IdNav = (typeof enlacesNav)[number]["id"];
