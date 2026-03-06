"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Definición de cada pestaña de navegación del grupo */
const PESTANAS = [
  {
    clave: "integrantes",
    etiqueta: "Integrantes",
    href: (id: string) => `/groups/${id}`,
  },
  {
    clave: "mapa",
    etiqueta: "Mapa",
    href: (id: string) => `/groups/${id}/mapa`,
  },
  {
    clave: "docente",
    etiqueta: "Docente",
    href: (id: string) => `/groups/${id}/docente`,
  },
] as const;

type ClavePestana = (typeof PESTANAS)[number]["clave"];

interface TabBarProps {
  grupoId: string;
}

/**
 * Barra de pestañas del grupo.
 * Usa <Link> de Next.js y detecta la pestaña activa con usePathname().
 * - Pestaña activa: fondo blanco, altura completa (86px)
 * - Pestañas inactivas: fondo gris #D9D9D9, posición más baja
 */
export function TabBar({ grupoId }: TabBarProps) {
  const pathname = usePathname();

  const pestanaActiva: ClavePestana = (() => {
    if (pathname.startsWith(`/groups/${grupoId}/mapa`)) return "mapa";
    if (pathname.startsWith(`/groups/${grupoId}/docente`)) return "docente";
    return "integrantes";
  })();

  return (
    <div className="flex items-end gap-0 shrink-0" style={{ height: 86 }}>
      {PESTANAS.map(({ clave, etiqueta, href }) => {
        const activa = pestanaActiva === clave;
        return (
          <Link
            key={clave}
            href={href(grupoId)}
            className="relative flex items-center justify-center focus:outline-none"
            style={{
              width: "clamp(140px, 14vw, 256px)",
              height: activa ? 86 : 65,
              borderRadius: "25px 25px 0 0",
              background: activa ? "#FFFFFF" : "#D9D9D9",
              marginTop: activa ? 0 : "auto",
              textDecoration: "none",
            }}
          >
            <span
              className="font-normal"
              style={{
                fontSize: "clamp(14px, 1.5vw, 24px)",
                color: activa ? "#3A3A3A" : "#8A8A8A",
              }}
            >
              {etiqueta}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
