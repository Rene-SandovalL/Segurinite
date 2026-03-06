import type { AlumnoMock } from "@/lib/mock/alumnos";

/**
 * Campo de sólo lectura.
 * - `span`: cuántas columnas ocupa dentro del CSS Grid padre (default 1)
 * - altura fija para que todos los fields sean uniformes verticalmente
 */
function Field({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: string;
  span?: number;
}) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        background: "#FFFFFF",
        borderRadius: 20,
        padding: "6px 18px 10px",
        height: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 13, color: "#7A7A7A", lineHeight: 1 }}>{label}</span>
      <span style={{ fontSize: 18, color: "#3A3A3A", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

/** Línea separadora */
function Divider() {
  return <div style={{ width: "100%", height: 1, background: "#C4C4C4" }} />;
}

interface StudentViewProps {
  alumno: AlumnoMock;
  grupoNombre: string;
  grupoColor: string;
  onBack: () => void;
}

export default function StudentView({ alumno, onBack }: StudentViewProps) {
  const vitales = alumno.datosVitales;
  const contacto = alumno.contactosEmergencia?.[0];

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        borderRadius: 25,
        overflow: "hidden",
      }}
    >
      {/* ══════════════════════════════════════════
          PANEL IZQUIERDO — información personal
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 60%",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Zona blanca: encabezado ── */}
        <div style={{ padding: "22px 28px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={onBack}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
              aria-label="Volver"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z"
                  fill="#1D1B20"
                />
              </svg>
            </button>

            <span
              style={{
                flex: 1,
                fontSize: "clamp(20px, 2.2vw, 32px)",
                fontWeight: 400,
                color: "#3A3A3A",
              }}
            >
              Informacion personal
            </span>

            <span style={{ fontSize: 13, color: "#8A8A8A", flexShrink: 0 }}>
              ID: {alumno.idDispositivo ?? "—"}
            </span>
          </div>

          <p style={{ margin: "6px 0 0 58px", fontSize: 14, color: "#000000" }}>
            Ultima conexión: {alumno.ultimaConexion ?? "Desconocida"}
          </p>
        </div>

        {/* Divisor blanco ↔ gris */}
        <Divider />

        {/* ── Zona gris scrollable: secciones de información ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#E0E0E0",
            padding: "14px 28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, color: "#3A3A3A" }}>Informacion de el usuario</span>
          <Divider />

          {/* Grid de 10 columnas — span controla ancho, altura fija en Field */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
            {/* Nombre(8) + Edad(2) */}
            <Field label="Nombre" value={`${alumno.nombre} ${alumno.apellido}`} span={8} />
            <Field label="Edad" value={String(alumno.edad ?? "—")} span={2} />

            {/* Fecha(5) + Tipo de sangre(3) — dejan 2 cols vacías a la derecha */}
            <Field label="Fecha de Nacimiento" value={alumno.fechaNacimiento ?? "—"} span={5} />
            <Field label="Tipo de sangre" value={alumno.tipoSangre ?? "—"} span={3} />

            {/* Dirección — ancho completo */}
            <Field label="Direccion" value={alumno.direccion ?? "—"} span={10} />

            {/* Nombre del Padre(6) + Teléfono(4) */}
            <Field label="Nombre del Padre" value={alumno.nombrePadre ?? "—"} span={6} />
            <Field label="Num. Telefono" value={alumno.telefonoPadre ?? "—"} span={4} />
          </div>

          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 16, color: "#3A3A3A" }}>Contacto(s) de emergencia</span>
          </div>
          <Divider />

          {contacto ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
              {/* Nombre(4) + Edad(2) + Fecha(4) */}
              <Field label="Nombre" value={contacto.nombre} span={4} />
              <Field label="Edad" value={String(contacto.edad)} span={2} />
              <Field label="Fecha de Nacimiento" value={contacto.fechaNacimiento} span={4} />

              {/* Teléfono — solo 4 cols, no fuerza ancho completo */}
              <Field label="Num. Telefono" value={contacto.telefono} span={4} />
            </div>
          ) : (
            <span style={{ color: "#8A8A8A", fontSize: 15 }}>
              Sin contactos de emergencia registrados.
            </span>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PANEL DERECHO — foto + datos vitales
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          background: "#3A3A3A",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Foto placeholder */}
        <div
          style={{
            width: "100%",
            height: "32%",
            background: "#D9D9D9",
            flexShrink: 0,
          }}
        />

        {/* Contenido vitales — scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 16px 20px",
            gap: 12,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(20px, 2.5vw, 38px)",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Datos Vitales
          </span>

          {/* Tarjeta presión arterial — borde rojo */}
          <div
            style={{
              width: "90%",
              background: "#3A3A3A",
              borderRadius: 22,
              border: "4px solid #FA3A3A",
              padding: "10px 18px 14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ textAlign: "center", paddingBottom: 2 }}>
              <span style={{ color: "#FFF", fontSize: "clamp(16px, 1.8vw, 28px)" }}>
                Presion arterial
              </span>
            </div>
            <div style={{ textAlign: "center", paddingBottom: 6 }}>
              <span style={{ color: "#FFF", fontSize: "clamp(11px, 1.2vw, 18px)" }}>
                ({vitales?.ultimaLectura ?? "—"})
              </span>
            </div>

            <div style={{ height: 1, background: "#6A6A6A" }} />

            {[
              { label: "SYS", value: vitales?.presionSys },
              { label: "DIA", value: vitales?.presionDia },
              { label: "PULSE", value: vitales?.pulso },
            ].map(({ label, value }, i, arr) => (
              <div key={label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 6px",
                  }}
                >
                  <span style={{ color: "#FFF", fontSize: "clamp(14px, 1.8vw, 30px)" }}>{label}</span>
                  <span style={{ color: "#FFF", fontSize: "clamp(14px, 1.8vw, 30px)" }}>{value ?? "—"}</span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ height: 1, background: "#6A6A6A" }} />
                )}
              </div>
            ))}
          </div>

          {/* Tarjeta temperatura — borde azul */}
          <div
            style={{
              width: "90%",
              background: "#3A3A3A",
              borderRadius: 22,
              border: "4px solid #575EAA",
              padding: "10px 18px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "#FFF", fontSize: "clamp(16px, 1.8vw, 32px)" }}>
              Temperatura
            </span>
            <span style={{ color: "#FFF", fontSize: "clamp(26px, 3.5vw, 56px)" }}>
              {vitales ? `${vitales.temperatura} °C` : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
