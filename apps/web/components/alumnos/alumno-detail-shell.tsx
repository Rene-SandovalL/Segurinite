import { AlumnoBackButton } from "./alumno-back-button";
import type { Alumno } from "../../types/alumno";
import { AlumnoInfoPersonal } from "./alumno-info-personal";
import { AlumnoContactoEmergencia } from "./alumno-contacto-emergencia";
import { AlumnoFoto } from "./alumno-foto";
import { AlumnoDatosVitales } from "./alumno-datos-vitales";

interface AlumnoDetailShellProps {
  alumno: Alumno;
  grupoId: string;
}

export function AlumnoDetailShell({ alumno, grupoId }: AlumnoDetailShellProps) {
  return (
    <div className="h-full grid grid-cols-1 xl:grid-cols-[58%_42%] rounded-[18px] overflow-hidden">
      {/* ── Panel izquierdo: información personal ── */}
      <div className="bg-[#dddde0] flex flex-col">
        {/* Cabecera */}
        <div className="bg-[#ededef] px-10 pt-7 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <AlumnoBackButton href={`/grupos/${grupoId}/integrantes`} />
              <h2 className="text-2xl leading-none text-gray-800 font-semibold">
                Informacion personal
              </h2>
            </div>
            <span className="text-sm text-gray-400 leading-tight text-right shrink-0">
              ID: {alumno.idDispositivo ?? "SEG-WB"}
            </span>
          </div>
          <p className="mt-3 ml-13 text-sm text-gray-500">
            Ultima conexión: {alumno.ultimaConexion ?? "Hace 5 minutos"}
          </p>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 px-10 pt-5 pb-10 overflow-y-auto">
          <AlumnoInfoPersonal alumno={alumno} />
          <AlumnoContactoEmergencia contactos={alumno.contactosEmergencia} />
        </div>
      </div>

      {/* ── Panel derecho: foto + datos vitales ── */}
      <div className="bg-[#3b3b45] flex flex-col">
        <AlumnoFoto
          fotoUrl={alumno.fotoUrl}
          iniciales={alumno.iniciales}
          nombre={`${alumno.nombre} ${alumno.apellido}`}
        />
        <div className="flex-1 overflow-y-auto px-10 pb-8">
          <AlumnoDatosVitales datosVitales={alumno.datosVitales} />
        </div>
      </div>
    </div>
  );
}
