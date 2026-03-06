import type { DocenteGrupo } from "@/types/usuario";

interface CampoDocenteProps {
  etiqueta: string;
  valor: string;
}

/** Campo de solo lectura: etiqueta gris arriba, valor oscuro abajo */
function CampoDocente({ etiqueta, valor }: CampoDocenteProps) {
  return (
    <div
      className="flex flex-col justify-center rounded-[25px] bg-white"
      style={{
        padding: "8px 20px 10px",
        minHeight: 56,
        gap: 2,
      }}
    >
      <span className="text-[14px] text-[#6A6A6A] leading-none">{etiqueta}</span>
      <span className="text-[20px] text-[#3A3A3A] leading-snug">{valor}</span>
    </div>
  );
}

interface DocentePerfilProps {
  docente?: DocenteGrupo;
}

/**
 * Panel de la pestaña "Docente".
 * Muestra avatar, nombre del docente y sus datos en una tarjeta gris.
 */
export function DocentePerfil({ docente }: DocentePerfilProps) {
  if (!docente) {
    return (
      <div className="h-full flex items-center justify-center text-[#8A8A8A] text-[20px]">
        No hay docente asignado a este grupo.
      </div>
    );
  }

  const campos: CampoDocenteProps[] = [
    { etiqueta: "Nombre plataforma", valor: docente.nombrePlataforma },
    { etiqueta: "Gateway",           valor: docente.gatewayEstado },
    { etiqueta: "Fecha de Nacimiento", valor: docente.fechaNacimiento },
    { etiqueta: "Correo",            valor: docente.correo },
    { etiqueta: "Teléfono",          valor: docente.telefono },
    { etiqueta: "Observaciones",     valor: docente.observaciones },
  ];

  return (
    <div
      className="h-full overflow-y-auto flex flex-col items-center"
      style={{ padding: "40px 32px 32px", gap: 24 }}
    >
      {/* ── Avatar ─────────────────────────────────────── */}
      <div
        className="rounded-full shrink-0"
        style={{ width: 150, height: 150, background: "#D9D9D9" }}
      />

      {/* ── Nombre del docente ─────────────────────────── */}
      <h2
        className="m-0 font-normal text-black text-center"
        style={{ fontSize: "clamp(24px, 2.8vw, 40px)" }}
      >
        Profesor. {docente.nombreCompleto}
      </h2>

      {/* ── Tarjeta gris con campos ────────────────────── */}
      <div
        className="w-full rounded-[30px]"
        style={{
          maxWidth: 860,
          background: "#D9D9D9",
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {campos.map(({ etiqueta, valor }) => (
          <CampoDocente key={etiqueta} etiqueta={etiqueta} valor={valor} />
        ))}
      </div>
    </div>
  );
}
