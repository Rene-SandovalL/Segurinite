import Link from "next/link";
import type { GrupoMock } from "@/lib/mock/grupos";
import { COLOR_HEX } from "@/lib/mock/grupos";

interface SidebarGrupoItemProps {
  grupo: GrupoMock;
  activo: boolean;
}

/**
 * Ítem individual en el sidebar del dashboard.
 * Usa <Link> de Next.js para navegar — el grupo activo se detecta en el padre.
 */
export function SidebarGrupoItem({ grupo, activo }: SidebarGrupoItemProps) {
  const colorFranja = COLOR_HEX[grupo.color];

  return (
    <Link
      href={`/groups/${grupo.id}`}
      className="relative w-full h-28.75 rounded-[25px] overflow-hidden block focus:outline-none"
      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Fondo blanco */}
      <div className="absolute inset-0 bg-white" />

      {/* Franja lateral de color */}
      <div
        className="absolute left-0 top-0 h-full w-26.5"
        style={{ background: colorFranja }}
      />

      {/* Inicial "G" centrada en la franja */}
      <div className="absolute left-0 top-0 h-full w-26.5 flex items-center justify-center">
        <span className="text-white text-[32px] font-normal leading-none select-none">
          {grupo.iconText}
        </span>
      </div>

      {/* Contenido derecho */}
      <div className="absolute left-28.25 right-4 top-0 h-full flex flex-col justify-center gap-0">
        {/* Nombre del grupo */}
        <span className="text-[#3A3A3A] text-[20px] font-normal leading-tight text-center">
          {grupo.nombre}
        </span>

        {/* Línea divisora */}
        <div className="w-full h-px bg-[#3A3A3A] my-1" />

        {/* Burbujas representativas de integrantes */}
        <div className="flex gap-2 justify-center items-center">
          {Array.from({ length: grupo.bubbles }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full shrink-0"
              style={{ background: activo ? "#fff" : "#D9D9D9" }}
            />
          ))}
        </div>
      </div>

      {/* Borde de selección cuando está activo */}
      {activo && (
        <div
          className="absolute inset-0 rounded-[25px] border-2 pointer-events-none"
          style={{ borderColor: colorFranja }}
        />
      )}
    </Link>
  );
}
