import { Avatar } from "../ui/avatar";
import { InfoField } from "../ui/info-field";
import type { DocenteGrupo } from "../../types/usuario";

interface DocenteProfilePanelProps {
  docente: DocenteGrupo;
}

export function DocenteProfilePanel({ docente }: DocenteProfilePanelProps) {
  return (
    <div className="flex flex-col items-center gap-10 px-4 cursor-default select-none">
      <Avatar initials={docente.iniciales} size="lg" />

      <h2 className="text-[clamp(2rem,2.4vw,2.9rem)] text-gray-900 leading-none font-normal text-center">
        Profesor. {docente.nombreCompleto}
      </h2>

      <div
        className="w-full rounded-[30px] bg-[#cfd0d2]"
        style={{ maxWidth: "1120px", minHeight: "300px", padding: "24px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <InfoField label="Nombre" value={docente.nombrePlataforma} />
          <InfoField label="Gateway" value={docente.gatewayEstado} />
          <InfoField label="Fecha de Nacimiento" value={docente.fechaNacimiento} />
          <InfoField label="Correo" value={docente.correo} />
          <InfoField label="Teléfono" value={docente.telefono} />
          <InfoField label="Observaciones" value={docente.observaciones} />
        </div>
      </div>
    </div>
  );
}
