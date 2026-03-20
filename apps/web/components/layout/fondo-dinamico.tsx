"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  COLOR_FONDO_PREDETERMINADO,
  resolverColorHex,
  type GrupoMock,
} from "@/lib/mock/grupos";

interface FondoDinamicoProps {
  children: React.ReactNode;
  grupos: GrupoMock[];
}

interface MenuDerechoButtonProps {
  label: string;
  variant?: "default" | "danger";
  href?: string;
  onClick?: () => void;
}

function MenuDerechoButton({
  label,
  variant = "default",
  href,
  onClick,
}: MenuDerechoButtonProps) {
  const isDanger = variant === "danger";

  const sharedClassName =
    "w-full h-16 rounded-[25px] flex items-center justify-center relative";

  const sharedStyle = {
    background: isDanger ? "#E74C3C" : "#FFFFFF",
    color: isDanger ? "#FFFFFF" : "#000000",
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
  } as const;

  const content = (
    <>
      <span className="font-normal" style={{ fontSize: "clamp(24px, 2vw, 30px)" }}>
        {label}
      </span>

      {isDanger && (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-10"
          aria-hidden="true"
        >
          <path
            d="M20 21.25L26.25 15M26.25 15L20 8.75M26.25 15H11.25M11.25 3.75H9.75C7.6498 3.75 6.5997 3.75 5.79754 4.15873C5.09193 4.51825 4.51825 5.09193 4.15873 5.79754C3.75 6.5997 3.75 7.6498 3.75 9.75V20.25C3.75 22.3503 3.75 23.4002 4.15873 24.2025C4.51825 24.9081 5.09193 25.4818 5.79754 25.8413C6.5997 26.25 7.6498 26.25 9.75 26.25H11.25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${sharedClassName} no-underline`}
        style={sharedStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={sharedClassName}
      style={sharedStyle}
    >
      {content}
    </button>
  );
}

/**
 * Envuelve el área principal del dashboard con el fondo de color dinámico.
 * Es un Client Component porque necesita usePathname() para detectar el grupo activo.
 */
export function FondoDinamico({ children, grupos }: FondoDinamicoProps) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoId = segmentos[2] ?? "";

  const grupo = grupos.find((g) => g.id === grupoId);
  const colorFondo = grupo
    ? resolverColorHex(grupo.color)
    : COLOR_FONDO_PREDETERMINADO;

  const grupoIdContexto = grupo?.id ?? grupos[0]?.id;
  const rutaNuevoRegistro = grupoIdContexto
    ? `/groups/${grupoIdContexto}/nuevo-registro`
    : "/groups/nuevo";

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  return (
    <main className="relative flex-1 h-full overflow-hidden flex flex-col">
      {/* Fondo del color del grupo — cubre todo el panel */}
      <div className="absolute inset-0" style={{ background: colorFondo }} />

      <button
        type="button"
        className="absolute right-8 top-8 w-16 h-16 rounded-full bg-white flex items-center justify-center focus:outline-none z-30"
        style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
        aria-label="Menú"
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((estadoAnterior) => !estadoAnterior)}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M2.667 10.667H18.667M2.667 5.333H18.667M2.667 16H18.667"
            stroke="#1E1E1E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Contenido sobre el fondo */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          pointerEvents: menuAbierto ? "auto" : "none",
          opacity: menuAbierto ? 1 : 0,
        }}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.15)", border: "none" }}
          onClick={() => setMenuAbierto(false)}
        />

        <aside
          className="absolute top-0 right-0 h-full bg-white transition-transform duration-300 ease-out"
          style={{
            width: "clamp(310px, 28vw, 430px)",
            transform: menuAbierto ? "translateX(0)" : "translateX(100%)",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.18)",
          }}
        >
          <div className="h-full overflow-y-auto px-7 pt-24 pb-12">
            <div className="text-[#3A3A3AAA] font-normal" style={{ fontSize: "clamp(22px, 2vw, 30px)" }}>
              Acciones
            </div>

            <div className="mt-4">
              <MenuDerechoButton
                label="Agregar alumno nuevo"
                href={rutaNuevoRegistro}
                onClick={() => setMenuAbierto(false)}
              />
            </div>

            <div className="mt-4">
              <MenuDerechoButton label="Ver historial de alertas" />
            </div>

            <div className="text-[#3A3A3AAA] font-normal mt-6" style={{ fontSize: "clamp(22px, 2vw, 30px)" }}>
              Administrar
            </div>

            <div className="mt-4 space-y-4">
              <MenuDerechoButton label="Gestionar personal" />
              <MenuDerechoButton label="Configuración" />
              <MenuDerechoButton label="Soporte Técnico" />
            </div>

            <div className="mt-5">
              <MenuDerechoButton label="Cerrar Sesión" variant="danger" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
