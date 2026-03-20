import { Fragment } from "react";
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

  const tutores =
    alumno.tutores && alumno.tutores.length > 0
      ? alumno.tutores.slice(0, 2)
      : alumno.nombrePadre
        ? [
            {
              nombre: alumno.nombrePadre,
              telefono: alumno.telefonoPadre ?? "—",
              direccion: alumno.direccion,
            },
          ]
        : [];

  const direccionesTutor: string[] = [];
  const direccionesVistas = new Set<string>();

  for (const tutor of tutores) {
    const direccion = tutor.direccion?.trim();
    if (!direccion) {
      continue;
    }

    const key = direccion.toLowerCase();
    if (direccionesVistas.has(key)) {
      continue;
    }

    direccionesVistas.add(key);
    direccionesTutor.push(direccion);
  }

  const direccionesAMostrar =
    direccionesTutor.length > 0
      ? direccionesTutor
      : [alumno.direccion?.trim() || "—"];

  const etiquetaTutor = (index: number, parentesco?: string) => {
    const parentescoLimpio = parentesco?.trim();

    if (parentescoLimpio) {
      const parentescoNormalizado = parentescoLimpio.toLowerCase();
      const articulo = parentescoNormalizado === "madre" ? "de la" : "del";
      return `Nombre ${articulo} ${parentescoLimpio}`;
    }

    if (tutores.length > 1) {
      return `Nombre del Tutor ${index + 1}`;
    }

    return "Nombre del Tutor";
  };

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

          {/* Direccion(es) de tutor(es) */}
          {direccionesAMostrar.map((direccion, index) => (
            <CampoLectura
              key={`direccion-${index}-${direccion}`}
              etiqueta={
                direccionesAMostrar.length > 1 ? `Direccion ${index + 1}` : "Direccion"
              }
              valor={direccion}
              span={10}
            />
          ))}

          {/* Tutor(es): nombre + teléfono */}
          {tutores.length > 0 ? (
            tutores.map((tutor, index) => (
              <Fragment key={`${tutor.nombre}-${index}`}>
                <CampoLectura
                  etiqueta={etiquetaTutor(index, tutor.parentesco)}
                  valor={tutor.nombre || "—"}
                  span={6}
                />
                <CampoLectura
                  etiqueta="Num. Telefono"
                  valor={tutor.telefono || "—"}
                  span={4}
                />
              </Fragment>
            ))
          ) : (
            <>
              <CampoLectura etiqueta="Nombre del Tutor" valor="—" span={6} />
              <CampoLectura etiqueta="Num. Telefono" valor="—" span={4} />
            </>
          )}
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
