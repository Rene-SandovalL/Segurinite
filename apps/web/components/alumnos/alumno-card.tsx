import { type Alumno } from "../../types/alumno";

interface AlumnoCardProps {
  alumno: Alumno;
}

export function AlumnoCard({ alumno }: AlumnoCardProps) {
  const esPeligro = alumno.estado === "peligro";
  const esAlerta  = alumno.estado === "alerta";

  return (
    <div
      className={`
        flex items-center rounded-2xl overflow-hidden shadow-sm
        border border-gray-200 cursor-pointer
        hover:shadow-md transition-all h-[56px]
        ${esPeligro ? "" : "bg-white"}
      `}
    >
      {/* Avatar con iniciales */}
      <div className="w-[52px] h-full shrink-0 bg-[#5c5ca8] flex items-center justify-center">
        <span className="text-white text-sm font-bold">{alumno.iniciales}</span>
      </div>

      {/* Nombre completo en mayúsculas */}
      <div
        className={`
          flex-1 h-full flex items-center px-4 min-w-0
          ${esPeligro
            ? "bg-[#d97070] text-white"
            : esAlerta
              ? "bg-amber-200 text-amber-900"
              : "bg-white text-gray-700"
          }
        `}
      >
        <span className="text-[13px] font-semibold uppercase leading-tight truncate">
          {alumno.nombre} {alumno.apellido}
        </span>
      </div>
    </div>
  );
}