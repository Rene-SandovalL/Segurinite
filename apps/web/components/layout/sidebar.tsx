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
    alert("Luego");
  }

  return (
    <aside className="w-82.5 h-full bg-[#f5f5f5] flex flex-col shrink-0 z-10 border-r border-gray-300/60">
      <SidebarHeader />

      <div className="mx-7 border-t border-gray-500/60" />

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-7 flex flex-col gap-7">
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