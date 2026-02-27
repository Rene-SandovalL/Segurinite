import { type Grupo, type ColorGrupo } from "../../types/grupo";

/** Mapa de color del grupo → clase de fondo de Tailwind */
const mapaColores: Record<ColorGrupo, string> = {
  morado:        "bg-[#5c5ca8]",
  naranja:       "bg-[#e8692a]",
  verde:         "bg-[#3a8a3a]",
  "verde-oscuro": "bg-[#2d5a5a]",
};

interface GrupoCardProps {
  grupo: Grupo;
  activo: boolean; // true si este grupo es el seleccionado actualmente
}

/**
 * Tarjeta visual de un grupo en el sidebar.
 * Muestra: avatar coloreado con "G", nombre del grupo, e indicadores (puntos).
 *
 * Los puntos representan visualmente la cantidad de alumnos (máx. 8 puntos).
 */
export function GrupoCard({ grupo, activo }: GrupoCardProps) {
  return (
    <div
      className={`
        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer
        border border-gray-200 shadow-sm
        ${activo ? "bg-gray-50 shadow-md" : "bg-white hover:bg-gray-50 hover:shadow-md"}
      `}
    >
      {/* Avatar cuadrado con color del grupo */}
      <div
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          text-white font-bold text-lg shrink-0
          ${mapaColores[grupo.color]}
        `}
      >
        G
      </div>

      {/* Nombre e indicadores de alumnos */}
      <div className="flex flex-col items-start gap-1.5 min-w-0">
        <span className="text-sm font-bold text-gray-700 truncate w-full text-left">
          {grupo.nombre}
        </span>

        {/*
          Puntos grises: representan visualmente el total de alumnos.
          Se muestran máximo 8 para no desbordar el sidebar.
        */}
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: Math.min(grupo.totalAlumnos, 8) }).map((_, i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
          ))}
        </div>
      </div>
    </div>
  );
}