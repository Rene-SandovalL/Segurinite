import { type Grupo, type ColorGrupo } from "../../types/grupo";

const mapaColores: Record<ColorGrupo, string> = {
  morado:         "bg-[#5c5ca8]",
  naranja:        "bg-[#e8692a]",
  verde:          "bg-[#3a8a3a]",
  "verde-oscuro": "bg-[#2d5a5a]",
};

interface GrupoCardProps {
  grupo: Grupo;
  activo: boolean;
}

export function GrupoCard({ grupo, activo }: GrupoCardProps) {
  return (
    <div
      className={`
        w-full flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all cursor-pointer
        shadow-sm border
        ${activo
          ? "bg-gray-50 shadow-md border-gray-300"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md"
        }
      `}
    >
      {/* Avatar cuadrado grande con color del grupo */}
      <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center
          text-white font-bold text-xl shrink-0
          ${mapaColores[grupo.color]}
        `}
      >
        G
      </div>

      {/* Nombre + indicadores */}
      <div className="flex flex-col items-start gap-2 min-w-0">
        {/* Nombre del grupo + línea decorativa */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
            {grupo.nombre}
          </span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Puntos indicadores de alumnos */}
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: Math.min(grupo.totalAlumnos, 6) }).map((_, i) => (
            <span key={i} className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
          ))}
        </div>
      </div>
    </div>
  );
}