import type { AlumnoMock } from "@/lib/mock/alumnos";
import MemberCard from "./MemberCard";

interface MembersTabProps {
  alumnos: AlumnoMock[];
  stripColor: string;
  onSelectAlumno?: (id: string) => void;
  onAddMember?: () => void;
}

/**
 * Panel de la pestaña "Integrantes".
 * Grid de 3 columnas de tarjetas de alumnos + botón agregar.
 */
export default function MembersTab({ alumnos, stripColor, onSelectAlumno, onAddMember }: MembersTabProps) {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      {/* contenedor interior con margen para no tocar los bordes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, margin: 32 }}>
        {/* grid 3 columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {alumnos.map((alumno) => (
            <MemberCard key={alumno.id} alumno={alumno} stripColor={stripColor} onClick={() => onSelectAlumno?.(alumno.id)} />
          ))}
        </div>

        {/* botón agregar integrante */}
        <button
          onClick={onAddMember}
          style={{
            width: "100%",
            height: 64,
            borderRadius: 25,
            background: "#D9D9D9",
            color: "#3A3A3A",
            fontSize: "clamp(24px, 2.5vw, 36px)",
            fontWeight: 400,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
          }}
          aria-label="Agregar integrante"
        >
          +
        </button>
      </div>
    </div>
  );
}
