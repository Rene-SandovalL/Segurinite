"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { GrupoMock } from "@/lib/mock/grupos";
import { SidebarGrupoItem } from "./sidebar-grupo-item";

interface SidebarProps {
  grupos: GrupoMock[];
}

interface SidebarMenuButtonProps {
  label: string;
  variant?: "default" | "danger";
  href?: string;
  onClick?: () => void;
}

function SidebarMenuButton({
  label,
  variant = "default",
  href,
  onClick,
}: SidebarMenuButtonProps) {
  const isDanger = variant === "danger";

  const sharedClassName =
    "w-full h-16 rounded-[25px] flex items-center justify-center relative";

  const sharedStyle = {
    background: isDanger ? "#E74C3C" : "#FFFFFF",
    color: isDanger ? "#FFFFFF" : "#000000",
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
  } as const;

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${sharedClassName} no-underline`}
        style={sharedStyle}
      >
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
    </button>
  );
}

/**
 * Sidebar izquierdo del dashboard.
 * Detecta el grupo activo con usePathname() y usa Links internamente.
 */
export function Sidebar({ grupos }: SidebarProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname();
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoIdActivo = segmentos[2] ?? "";
  const grupoIdContexto =
    grupos.find((grupo) => grupo.id === grupoIdActivo)?.id ?? grupos[0]?.id;
  const rutaNuevoRegistro = grupoIdContexto
    ? `/groups/${grupoIdContexto}/nuevo-registro`
    : "/groups/nuevo";

  return (
    <aside
      className="relative flex flex-col bg-white h-full shrink-0"
      style={{ width: "clamp(280px, 24vw, 463px)" }}
    >
      {/* ── Encabezado ───────────────────────────────────── */}
      <div className="relative h-40.5 shrink-0 overflow-hidden">
        {/* Botón de menú */}
        <button
          type="button"
          className="absolute left-8.25 top-8 w-16 h-16 rounded-full bg-white flex items-center justify-center focus:outline-none"
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

        {/* Nombre del sistema */}
        <div className="absolute left-1/2 -translate-x-1/2 top-9.75 flex items-center">
          <span
            className="text-[#3A3A3A] font-normal text-center whitespace-nowrap"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            SEGURINITE
          </span>
        </div>

        {/* Línea divisora */}
        <div
          className="absolute bottom-0 h-0.5 bg-[#3A3A3A]"
          style={{ left: 33, right: 33 }}
        />
      </div>

      {/* ── Lista de grupos ───────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto">
          <div
            className="flex flex-col"
            style={{ gap: 24, margin: "32px 28px 24px 28px" }}
          >
            {grupos.map((grupo) => (
              <SidebarGrupoItem
                key={grupo.id}
                grupo={grupo}
                activo={grupoIdActivo === grupo.id}
              />
            ))}

            {/* Botón + agregar grupo */}
            <Link
              href="/groups/nuevo"
              className="w-full flex items-center justify-center rounded-[25px] text-[#3A3A3A] font-normal no-underline"
              style={{
                height: 64,
                fontSize: "clamp(24px, 2.5vw, 36px)",
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                background: grupoIdActivo === "nuevo" ? "#B8B8B8" : "#D9D9D9",
              }}
              aria-label="Crear nuevo grupo"
            >
              +
            </Link>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-white z-20 transition-transform duration-300 ease-out"
          style={{
            transform: menuAbierto ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="h-full overflow-y-auto px-7 pt-5 pb-12">
            <div className="text-[#3A3A3AAA] font-normal" style={{ fontSize: "clamp(22px, 2vw, 30px)" }}>
              Acciones
            </div>

            <div className="mt-4">
              <SidebarMenuButton
                label="Agregar alumno nuevo"
                href={rutaNuevoRegistro}
                onClick={() => setMenuAbierto(false)}
              />
            </div>

            <div className="mt-4">
              <SidebarMenuButton label="Ver historial de alertas" />
            </div>

            <div className="text-[#3A3A3AAA] font-normal mt-6" style={{ fontSize: "clamp(22px, 2vw, 30px)" }}>
              Administrar
            </div>

            <div className="mt-4 space-y-4">
              <SidebarMenuButton label="Gestionar personal" />
              <SidebarMenuButton label="Configuración" />
              <SidebarMenuButton label="Soporte Técnico" />
            </div>

            <div className="mt-5">
              <SidebarMenuButton label="Cerrar Sesión" variant="danger" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
