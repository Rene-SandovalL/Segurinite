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
        flex items-stretch rounded-[18px] overflow-hidden
        shadow-[0_2px_6px_rgba(0,0,0,0.14)] border border-gray-300/70
        cursor-pointer transition-all h-16.5 bg-white
      `}
    >
      <div className="w-19.5 h-full shrink-0 bg-[#5c5ca8] flex items-center justify-center">
        <span className="text-white text-[clamp(1.35rem,1.7vw,2rem)] leading-none font-medium">{alumno.iniciales}</span>
      </div>

      <div
        className={`
          flex-1 h-full flex items-center pl-12 pr-7 min-w-0
          ${esPeligro
            ? "bg-[#d86f6f] text-white"
            : esAlerta
              ? "bg-amber-200 text-amber-900"
              : "text-gray-600"
          }
        `}
      >
        <span className="text-[clamp(0.8rem,0.95vw,1.05rem)] font-semibold uppercase leading-tight truncate">
          {alumno.nombre} {alumno.apellido}
        </span>
      </div>
    </div>
  );
}