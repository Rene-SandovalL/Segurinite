import type { AlumnoMock } from "@/lib/mock/alumnos";

interface MemberCardProps {
  alumno: AlumnoMock;
  /** Color hex de la franja lateral (del grupo) */
  stripColor: string;
  onClick?: () => void;
}

/**
 * Tarjeta de un integrante dentro del panel de grupo.
 * - estado "peligro" → fondo rojo (#E66363), texto blanco
 * - estado normal    → fondo blanco, texto oscuro
 */
export default function MemberCard({ alumno, stripColor, onClick }: MemberCardProps) {
  const isRisk = alumno.estado === "peligro";
  const cardBg = isRisk ? "#E66363" : "#FFFFFF";
  const textColor = isRisk ? "#FFFFFF" : "#3A3A3A";

  return (
    <button
      onClick={onClick}
      className="relative w-full h-16 rounded-[25px] overflow-hidden text-left focus:outline-none"
      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
    >
      {/* fondo principal */}
      <div className="absolute inset-0" style={{ background: cardBg }} />

      {/* franja lateral de color del grupo */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{ width: "clamp(70px, 8vw, 106px)", background: stripColor }}
      />

      {/* iniciales en la franja */}
      <div
        className="absolute left-0 top-0 h-full flex items-center justify-center"
        style={{ width: "clamp(70px, 8vw, 106px)" }}
      >
        <span className="text-white font-normal text-[clamp(18px,2vw,32px)] leading-none select-none">
          {alumno.iniciales}
        </span>
      </div>

      {/* nombre */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          left: "calc(clamp(70px, 8vw, 106px) + 7px)",
          right: 8,
        }}
      >
        <span
          className="font-normal text-[clamp(12px,1.2vw,20px)] text-center leading-tight"
          style={{ color: textColor }}
        >
          {alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`}
        </span>
      </div>
    </button>
  );
}
