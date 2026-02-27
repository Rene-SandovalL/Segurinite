"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrupoCard } from "../grupos/grupo-card";
import { type Grupo } from "../../types/grupo";

interface SidebarProps {
  grupos: Grupo[];
}

export function Sidebar({ grupos }: SidebarProps) {
  const pathname = usePathname();

  function handleAgregarGrupo() {
    alert("Próximamente: Formulario para crear nuevo grupo");
  }

  return (
    <aside className="w-82.5 h-full bg-[#f5f5f5] flex flex-col shrink-0 z-10 border-r border-gray-300/60">

      {/* ── Logo / Encabezado ── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-300 text-gray-500 hover:text-gray-700 transition-all"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-[clamp(1.9rem,2.3vw,2.7rem)] leading-none font-light tracking-wide text-gray-700 uppercase">
            Segurinite
          </span>
        </div>
      </div>

      {/* ── Línea divisora ── */}
      <div className="mx-6 border-t border-gray-500/60" />

      {/* ── Lista de grupos ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 flex flex-col gap-6">
        {grupos.map((grupo) => {
          const estaActivo = pathname.includes(`/grupos/${grupo.id}`);
          return (
            <Link key={grupo.id} href={`/grupos/${grupo.id}/integrantes`}>
              <GrupoCard grupo={grupo} activo={estaActivo} />
            </Link>
          );
        })}

        {/* Botón agregar grupo */}
        <button
          onClick={handleAgregarGrupo}
          className="w-full h-12 rounded-2xl bg-[#d3d4d8] hover:bg-[#c8cacf] text-gray-600 text-4xl leading-none font-light transition-colors"
          aria-label="Agregar nuevo grupo"
        >
          +
        </button>
      </div>
    </aside>
  );
}