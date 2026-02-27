"use client";

import { usePathname } from "next/navigation";
import { type Grupo } from "../../types/grupo";
import { SidebarHeader } from "./sidebar-header";
import { GrupoCardList } from "../grupos/grupo-card-list";
import { AddGrupoButton } from "../grupos/add-grupo-button";

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
      <SidebarHeader />

      {/* ── Línea divisora ── */}
      <div className="mx-6 border-t border-gray-500/60" />

      {/* ── Lista de grupos ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-5 flex flex-col gap-6">
        <GrupoCardList
          grupos={grupos}
          grupoActivoId={grupos.find((grupo) => pathname.includes(`/grupos/${grupo.id}`))?.id}
        />

        {/* Botón agregar grupo */}
        <AddGrupoButton onClick={handleAgregarGrupo} />
      </div>
    </aside>
  );
}