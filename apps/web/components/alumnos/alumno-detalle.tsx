import type { AlumnoMock } from "@/lib/mock/alumnos";
import { AlumnoInfoPersonal } from "./alumno-info-personal";
import { AlumnoVitales } from "./alumno-vitales";

interface AlumnoDetalleProps {
  alumno: AlumnoMock;
}

/**
 * Vista de detalle completa de un alumno.
 * Divide la pantalla en dos paneles:
 * - Izquierdo (60%): información personal y contactos
 * - Derecho (40%): foto placeholder y datos vitales
 */
export function AlumnoDetalle({ alumno }: AlumnoDetalleProps) {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-[25px]">
      <AlumnoInfoPersonal alumno={alumno} />
      <AlumnoVitales vitales={alumno.datosVitales} />
    </div>
  );
}
