"use client";

import { useRouter } from "next/navigation";
import type { GrupoMock } from "@/lib/mock/grupos";

interface SelectorGrupoAsistenciaProps {
  grupos: GrupoMock[];
  grupoSeleccionadoId: string;
  fecha: string;
}

/**
 * Permite cambiar de grupo sin salir de la pestaña Asistencia: navega a
 * /groups/[nuevoGrupoId]/asistencia conservando la fecha seleccionada.
 */
export function SelectorGrupoAsistencia({
  grupos,
  grupoSeleccionadoId,
  fecha,
}: SelectorGrupoAsistenciaProps) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/groups/${event.target.value}/asistencia?fecha=${fecha}`);
  }

  return (
    <select
      value={grupoSeleccionadoId}
      onChange={handleChange}
      className="bg-white text-[#3A3A3A] focus:outline-none"
      style={{
        border: "1px solid #3A3A3A",
        borderRadius: 25,
        height: 44,
        padding: "0 16px",
        fontSize: 15,
      }}
      aria-label="Elegir grupo"
    >
      {grupos.map((grupo) => (
        <option key={grupo.id} value={grupo.id}>
          {grupo.nombre}
        </option>
      ))}
    </select>
  );
}
