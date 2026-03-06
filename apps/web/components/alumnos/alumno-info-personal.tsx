import type { AlumnoMock } from "@/lib/mock/alumnos";
import { BotonAtras } from "@/components/ui/boton-atras";
import { CampoLectura } from "@/components/ui/campo-lectura";

/** Línea separadora horizontal */
function Separador() {
  return <div className="w-full h-px bg-[#C4C4C4]" />;
}

interface AlumnoInfoPersonalProps {
  alumno: AlumnoMock;
}

/**
 * Panel izquierdo del detalle del alumno.
 * Muestra información personal, datos del padre y contacto de emergencia.
 */
export function AlumnoInfoPersonal({ alumno }: AlumnoInfoPersonalProps) {
  const contacto = alumno.contactosEmergencia?.[0];

  return (
    <div className="flex flex-col overflow-hidden" style={{ flex: "0 0 60%", background: "#FFFFFF" }}>
      {/* ── Encabezado: botón atrás + título ── */}
      <div className="shrink-0" style={{ padding: "22px 28px 14px" }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          {/* BotonAtras es Client Component (usa useRouter) */}
          <BotonAtras />

          <span
            className="flex-1 font-normal text-[#3A3A3A]"
            style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}
          >
            Informacion personal
          </span>

          <span className="text-[13px] text-[#8A8A8A] shrink-0">
            ID: {alumno.idDispositivo ?? "—"}
          </span>
        </div>

        <p className="text-[14px] text-black" style={{ margin: "6px 0 0 58px" }}>
          Ultima conexión: {alumno.ultimaConexion ?? "Desconocida"}
        </p>
      </div>

      <Separador />

      {/* ── Zona gris scrollable: datos del alumno ── */}
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{
          background: "#E0E0E0",
          padding: "14px 28px 24px",
          gap: 8,
        }}
      >
        <span className="text-[16px] text-[#3A3A3A]">Informacion de el usuario</span>
        <Separador />

        {/* Grid de 10 columnas con los campos del alumno */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 8,
          }}
        >
          {/* Nombre (8 cols) + Edad (2 cols) */}
          <CampoLectura
            etiqueta="Nombre"
            valor={`${alumno.nombre} ${alumno.apellido}`}
            span={8}
          />
          <CampoLectura etiqueta="Edad" valor={String(alumno.edad ?? "—")} span={2} />

          {/* Fecha de nacimiento (5) + Tipo de sangre (3) */}
          <CampoLectura
            etiqueta="Fecha de Nacimiento"
            valor={alumno.fechaNacimiento ?? "—"}
            span={5}
          />
          <CampoLectura
            etiqueta="Tipo de sangre"
            valor={alumno.tipoSangre ?? "—"}
            span={3}
          />

          {/* Dirección — ancho completo */}
          <CampoLectura etiqueta="Direccion" valor={alumno.direccion ?? "—"} span={10} />

          {/* Nombre del padre (6) + Teléfono (4) */}
          <CampoLectura
            etiqueta="Nombre del Padre"
            valor={alumno.nombrePadre ?? "—"}
            span={6}
          />
          <CampoLectura
            etiqueta="Num. Telefono"
            valor={alumno.telefonoPadre ?? "—"}
            span={4}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <span className="text-[16px] text-[#3A3A3A]">Contacto(s) de emergencia</span>
        </div>
        <Separador />

        {contacto ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 8,
            }}
          >
            {/* Nombre (4) + Edad (2) + Fecha (4) */}
            <CampoLectura etiqueta="Nombre" valor={contacto.nombre} span={4} />
            <CampoLectura etiqueta="Edad" valor={String(contacto.edad)} span={2} />
            <CampoLectura
              etiqueta="Fecha de Nacimiento"
              valor={contacto.fechaNacimiento}
              span={4}
            />

            {/* Teléfono */}
            <CampoLectura etiqueta="Num. Telefono" valor={contacto.telefono} span={4} />
          </div>
        ) : (
          <span className="text-[#8A8A8A] text-[15px]">
            Sin contactos de emergencia registrados.
          </span>
        )}
      </div>
    </div>
  );
}
