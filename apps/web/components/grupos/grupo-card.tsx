import { type Grupo } from "../../types/grupo";
import { coloresGrupo } from "../../lib/colores-grupo";

interface GrupoCardProps {
  grupo: Grupo;
  activo: boolean;
}

export function GrupoCard({ grupo, activo }: GrupoCardProps) {
  return (
    <div
      className={`
        w-78 h-23 flex items-stretch rounded-2xl transition-all cursor-pointer
        shadow-[0_2px_6px_rgba(0,0,0,0.12)] border overflow-hidden
        ${activo
          ? "bg-[#f5f5f6] border-gray-300"
          : "bg-[#f4f4f5] border-gray-300/80 hover:bg-[#f8f8f8]"
        }
      `}
    >
      {/* Bloque de color del grupo */}
      <div
        className={`
          w-19 h-full flex items-center justify-center
          text-white font-medium text-[clamp(1.5rem,2vw,2.1rem)] leading-none shrink-0
          ${coloresGrupo[grupo.color].bg}
        `}
      >
        G
      </div>

      {/* Nombre + indicadores */}
      <div className="flex-1 flex flex-col justify-center px-4 min-w-0">
        {/* Nombre del grupo + línea decorativa */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[clamp(1rem,1.35vw,1.7rem)] leading-none font-medium text-gray-700 whitespace-nowrap">
            {grupo.nombre}
          </span>
          <div className="flex-1 border-t border-gray-400/70" />
        </div>

        {/* Puntos indicadores de alumnos */}
        <div className="flex gap-1.5 mt-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="w-3 h-3 rounded-full bg-[#c8cbd0] inline-block" />
          ))}
        </div>
      </div>
    </div>
  );
}