import Link from "next/link";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { MiembroCard } from "./miembro-card";

interface IntegrantesListaProps {
  alumnos: AlumnoMock[];
  grupoId: string;
  colorFranja: string;
}

/**
 * Panel de la pestaña "Integrantes".
 * Muestra un grid de 3 columnas de tarjetas de alumnos.
 */
export function IntegrantesLista({ alumnos, grupoId, colorFranja }: IntegrantesListaProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col" style={{ gap: 18, margin: 32 }}>
        {/* Grid de 3 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
          }}
        >
          {alumnos.map((alumno) => (
            <MiembroCard
              key={alumno.id}
              alumno={alumno}
              grupoId={grupoId}
              colorFranja={colorFranja}
            />
          ))}
        </div>

        {/* Botón agregar integrante — navega al panel de añadir alumno */}
        <Link
          href={`/groups/${grupoId}/pulsera`}
          className="w-full flex items-center justify-center rounded-[25px] bg-[#D9D9D9] text-[#3A3A3A] font-normal focus:outline-none"
          style={{
            height: 64,
            fontSize: "clamp(24px, 2.5vw, 36px)",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            textDecoration: "none",
          }}
          aria-label="Agregar integrante"
        >
          +
        </Link>
      </div>
    </div>
  );
}
