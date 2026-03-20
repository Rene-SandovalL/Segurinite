import Link from "next/link";
import type { AlumnoMock } from "@/lib/mock/alumnos";

interface MiembroCardProps {
  alumno: AlumnoMock;
  grupoId: string;
  /** Color hex de la franja lateral (del grupo) */
  colorFranja: string;
}

/**
 * Tarjeta de un integrante del grupo.
 * - Estado "peligro" → fondo rojo (#E66363), texto blanco
 * - Estado normal    → fondo blanco, texto oscuro
 * Usa <Link> para navegar al detalle del alumno.
 */
export function MiembroCard({ alumno, grupoId, colorFranja }: MiembroCardProps) {
  const enPeligro = alumno.estado === "peligro";
  const fondoTarjeta = enPeligro ? "#E66363" : "#FFFFFF";
  const colorTexto = enPeligro ? "#FFFFFF" : "#3A3A3A";

  return (
    <Link
      href={`/groups/${grupoId}/alumnos/${alumno.id}`}
      className="relative w-full h-16 rounded-[25px] overflow-hidden block focus:outline-none"
      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Fondo principal */}
      <div className="absolute inset-0" style={{ background: fondoTarjeta }} />

      {/* Franja lateral de color del grupo */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{
          width: "clamp(70px, 8vw, 106px)",
          background: colorFranja,
        }}
      />

      {/* Iniciales en la franja */}
      <div
        className="absolute left-0 top-0 h-full flex items-center justify-center"
        style={{ width: "clamp(70px, 8vw, 106px)" }}
      >
        <span className="text-white font-normal leading-none select-none" style={{ fontSize: "clamp(18px, 2vw, 32px)" }}>
          {alumno.iniciales}
        </span>
      </div>

      {/* Nombre del alumno */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          left: "calc(clamp(70px, 8vw, 106px) + 7px)",
          right: 8,
        }}
      >
        <span
          className="font-normal text-center leading-tight"
          style={{
            fontSize: "clamp(12px, 1.2vw, 20px)",
            color: colorTexto,
            textTransform: "uppercase",
          }}
        >
          {alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`}
        </span>
      </div>
    </Link>
  );
}
