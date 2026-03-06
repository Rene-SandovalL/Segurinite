import type { DocenteGrupo } from "@/types/usuario";

interface DisplayLabelProps {
  label: string;
  value: string;
}

/** Campo de solo lectura: etiqueta gris arriba, valor oscuro abajo */
function DisplayLabel({ label, value }: DisplayLabelProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 25,
        padding: "8px 20px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 56,
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 14, color: "#6A6A6A", lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 20, color: "#3A3A3A", lineHeight: 1.3 }}>
        {value}
      </span>
    </div>
  );
}

interface DocenteTabProps {
  docente?: DocenteGrupo;
}

/**
 * Panel de la pestaña "Docente".
 * Muestra avatar, nombre del docente y sus datos en una tarjeta gris.
 */
export default function DocenteTab({ docente }: DocenteTabProps) {
  if (!docente) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A8A8A",
          fontSize: 20,
        }}
      >
        No hay docente asignado a este grupo.
      </div>
    );
  }

  const campos: DisplayLabelProps[] = [
    { label: "Nombre plataforma", value: docente.nombrePlataforma },
    { label: "Gateway",           value: docente.gatewayEstado },
    { label: "Fecha de Nacimiento", value: docente.fechaNacimiento },
    { label: "Correo",            value: docente.correo },
    { label: "Teléfono",          value: docente.telefono },
    { label: "Observaciones",     value: docente.observaciones },
  ];

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 32px 32px",
        gap: 24,
      }}
    >
      {/* ── Avatar ─────────────────────────────────────── */}
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "#D9D9D9",
          flexShrink: 0,
        }}
      />

      {/* ── Nombre del docente ─────────────────────────── */}
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(24px, 2.8vw, 40px)",
          fontWeight: 400,
          color: "#000000",
          textAlign: "center",
        }}
      >
        Profesor. {docente.nombreCompleto}
      </h2>

      {/* ── Tarjeta gris con campos ────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          background: "#D9D9D9",
          borderRadius: 30,
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {campos.map(({ label, value }) => (
          <DisplayLabel key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}
