import { type Alumno } from "../../types/alumno";

interface AlumnoCardProps {
  alumno: Alumno;
}

/**
 * Tarjeta visual de un alumno en el grid de integrantes.
 *
 * Estructura:
 *   [ Avatar ]  NOMBRE APELLIDO
 *
 * El avatar muestra las iniciales del alumno (ej: "AG" para Alejandro González)
 * con fondo morado (#5c5ca8), igual al diseño.
 *
 * Si el alumno tiene estado "peligro", el nombre se muestra con fondo rojo/coral.
 */
export function AlumnoCard({ alumno }: AlumnoCardProps) {
  const esPeligro = alumno.estado === "peligro";
  const esAlerta = alumno.estado === "alerta";

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer h-14">
      {/* Avatar con iniciales */}
      <div className="w-10 h-10 mx-2 rounded-lg shrink-0 bg-[#5c5ca8] flex items-center justify-center text-white text-xs font-bold">
        {alumno.iniciales}
      </div>

      {/* Nombre completo en mayúsculas — fondo rojo si estado es "peligro" */}
      <div
        className={`
          flex-1 h-full flex items-center px-3 min-w-0
          ${esPeligro
            ? "bg-[#d97070] text-white"
            : esAlerta
              ? "bg-amber-200 text-amber-900"
              : "text-gray-700"
          }
        `}
      >
        <span className="text-xs font-semibold uppercase leading-tight line-clamp-2">
          {alumno.nombre} {alumno.apellido}
        </span>
      </div>
    </div>
  );
}