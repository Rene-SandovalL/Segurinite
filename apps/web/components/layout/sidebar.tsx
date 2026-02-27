"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrupoCard } from "../grupos/grupo-card";
import { type Grupo } from "../../types/grupo";

interface SidebarProps {
  grupos: Grupo[];
}

/**
 * Barra lateral del dashboard.
 *
 * Usa usePathname() para saber qué grupo está activo comparando
 * la URL actual con el ID de cada grupo.
 * Ej: si la URL es /grupos/4a/integrantes → grupoId activo = "4a"
 */
export function Sidebar({ grupos }: SidebarProps) {
  const pathname = usePathname(); // ej: "/grupos/4a/integrantes"

  function handleAgregarGrupo() {
    // TODO: modal/formulario para crear nuevo grupo
    alert("Próximamente: Formulario para crear nuevo grupo");
  }

  return (
    <aside className="w-72 h-full bg-white flex flex-col shadow-lg shrink-0 z-10">

      {/* ── Logo / Encabezado ── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          {/* Ícono hamburguesa dentro de círculo con sombra */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-gray-700 hover:shadow-lg transition-all"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-2xl font-extrabold tracking-wider text-gray-800 uppercase">
            Segurinite
          </span>
        </div>
      </div>

      {/* ── Línea divisora ── */}
      <div className="mx-5 border-t border-gray-200" />

      {/* ── Lista de grupos + botón agregar ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {grupos.map((grupo) => {
          // Determina si este grupo es el activo según la URL
          const estaActivo = pathname.includes(`/grupos/${grupo.id}`);

          return (
            // Link de Next.js para navegar sin recargar la página
            <Link key={grupo.id} href={`/grupos/${grupo.id}/integrantes`}>
              <GrupoCard grupo={grupo} activo={estaActivo} />
            </Link>
          );
        })}

        {/* Botón agregar grupo — justo debajo del último grupo */}
        <button
          onClick={handleAgregarGrupo}
          className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-500 text-2xl font-light transition-colors"
          aria-label="Agregar nuevo grupo"
        >
          +
        </button>
      </div>
    </aside>
  );
}