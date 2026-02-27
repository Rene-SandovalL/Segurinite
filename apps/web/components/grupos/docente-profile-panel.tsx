import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import type { DocenteGrupo } from "../../types/usuario";

interface DocenteProfilePanelProps {
  docente: DocenteGrupo;
}

export function DocenteProfilePanel({ docente }: DocenteProfilePanelProps) {
  return (
    <div className="flex flex-col items-center gap-10 px-2">
      <Avatar initials={docente.iniciales} size="lg" />

      <h2 className="text-[clamp(1.8rem,2.2vw,2.4rem)] text-gray-800 leading-none font-medium text-center">
        Profesor. {docente.nombreCompleto}
      </h2>

      <div className="w-full max-w-[980px] rounded-[26px] bg-[#d1d1d3] px-7 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <Input label="Nombre" value={docente.nombrePlataforma} />
          <Input label="Gateway" value={docente.gatewayEstado} />
          <Input label="Fecha de Nacimiento" value={docente.fechaNacimiento} />
          <Input label="Correo" value={docente.correo} />
          <Input label="Teléfono" value={docente.telefono} />
          <Input label="Observaciones" value={docente.observaciones} />
        </div>
      </div>
    </div>
  );
}
