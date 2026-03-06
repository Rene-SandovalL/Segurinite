"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GRUPOS_MOCK } from "@/lib/mock/grupos";
import { SidebarGrupoItem } from "./sidebar-grupo-item";

/**
 * Sidebar izquierdo del dashboard.
 * Detecta el grupo activo con usePathname() y usa Links internamente.
 */
export function Sidebar() {
  const pathname = usePathname();
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoIdActivo = segmentos[2] ?? "";

  return (
    <aside
      className="relative flex flex-col bg-white h-full shrink-0"
      style={{ width: "clamp(280px, 24vw, 463px)" }}
    >
      {/* ── Encabezado ───────────────────────────────────── */}
      <div className="relative h-40.5 shrink-0 overflow-hidden">
        {/* Botón de menú */}
        <button
          className="absolute left-8.25 top-8 w-16 h-16 rounded-full bg-white flex items-center justify-center focus:outline-none"
          style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Menú"
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
      <div className="overflow-y-auto flex-1">
        <div
          className="flex flex-col"
          style={{ gap: 24, margin: "32px 28px 24px 28px" }}
        >
          {GRUPOS_MOCK.map((grupo) => (
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
    </aside>
  );
}
