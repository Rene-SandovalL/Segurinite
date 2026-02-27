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
    <aside className="w-[300px] h-full bg-white flex flex-col shrink-0 z-10 border-r border-gray-200">

      {/* ── Logo / Encabezado ── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-gray-700 transition-all"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-[22px] font-extrabold tracking-wider text-gray-800 uppercase">
            Segurinite
          </span>
        </div>
      </div>

      {/* ── Línea divisora ── */}
      <div className="mx-4 border-t border-gray-300" />

      {/* ── Lista de grupos ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 flex flex-col gap-4">
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
          className="w-full py-3.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-500 text-2xl font-light transition-colors"
          aria-label="Agregar nuevo grupo"
        >
          +
        </button>
      </div>
    </aside>
  );
}