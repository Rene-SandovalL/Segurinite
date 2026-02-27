import { AlumnoField } from "./alumno-field";
import type { Alumno } from "../../types/alumno";

interface AlumnoInfoPersonalProps {
  alumno: Alumno;
}

export function AlumnoInfoPersonal({ alumno }: AlumnoInfoPersonalProps) {
  return (
    <section>
      <h3 className="text-[15px] text-gray-600 font-medium mb-2">
        Informacion de el usuario
      </h3>
      <div className="border-t border-gray-400/50 mb-5" />

      <div className="space-y-5">
        <div className="flex items-start gap-4 min-w-0 flex-wrap md:flex-nowrap">
          <AlumnoField
            label="Nombre"
            value={alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`}
            className="flex-1 min-w-56"
          />
          <AlumnoField label="Edad" value={String(alumno.edad ?? "-")} className="w-20 shrink-0" />
        </div>

        <div className="flex items-start gap-4 min-w-0 flex-wrap md:flex-nowrap">
          <AlumnoField label="Fecha de Nacimiento" value={alumno.fechaNacimiento ?? "-"} className="flex-1 min-w-44" />
          <AlumnoField label="Tipo de sangre" value={alumno.tipoSangre ?? "-"} className="w-36" />
        </div>

        <div className="min-w-0">
          <AlumnoField
            label="Direccion"
            value={alumno.direccion ?? "-"}
            className="w-full max-w-lg"
            multiline
          />
        </div>

        <div className="flex items-start gap-4 min-w-0 flex-wrap md:flex-nowrap">
          <AlumnoField label="Nombre del Padre" value={alumno.nombrePadre ?? "-"} className="flex-1 min-w-56" />
          <AlumnoField label="Num. Telefono" value={alumno.telefonoPadre ?? "-"} className="w-44 shrink-0" />
        </div>
      </div>
    </section>
  );
}
