"use client";

import { useMemo, useState } from "react";
import type { GrupoMock } from "@/lib/mock/grupos";
import type { AsistenciaAlumno, AsistenciaEstado } from "@/types/asistencia";
import { SelectorFechaAsistencia } from "./selector-fecha-asistencia";
import { SelectorGrupoAsistencia } from "./selector-grupo-asistencia";

const ESTILO_ESTADO: Record<
  AsistenciaEstado,
  { fondo: string; texto: string; etiqueta: string }
> = {
  PRESENTE: {
    fondo: "var(--color-asistencia-presente-bg)",
    texto: "var(--color-asistencia-presente-texto)",
    etiqueta: "Presente",
  },
  TARDANZA: {
    fondo: "var(--color-asistencia-tardanza-bg)",
    texto: "var(--color-asistencia-tardanza-texto)",
    etiqueta: "Tardanza",
  },
  AUSENTE: {
    fondo: "var(--color-asistencia-ausente-bg)",
    texto: "var(--color-asistencia-ausente-texto)",
    etiqueta: "Ausente",
  },
};

function formatHora(iso: string | null): string {
  if (!iso) {
    return "—";
  }

  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AsistenciaTablaProps {
  asistencias: AsistenciaAlumno[];
  grupos: GrupoMock[];
  grupoSeleccionadoId: string;
  fecha: string;
}

/**
 * Tabla de solo lectura de la pestaña Asistencia: filtra client-side sobre
 * la lista ya cargada por nombre (grupos chicos, no hace falta endpoint de
 * búsqueda aparte). El selector de grupo/fecha vive aquí adentro (no junto al
 * TabBar) para que todo el panel quede en un solo bloque blanco continuo.
 */
export function AsistenciaTabla({
  asistencias,
  grupos,
  grupoSeleccionadoId,
  fecha,
}: AsistenciaTablaProps) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();

    if (!query) {
      return asistencias;
    }

    return asistencias.filter((asistencia) =>
      asistencia.nombre.toLowerCase().includes(query),
    );
  }, [asistencias, busqueda]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="shrink-0 flex items-center justify-between flex-wrap"
        style={{ padding: "28px clamp(20px, 3vw, 48px) 0", gap: 12 }}
      >
        <input
          type="text"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar alumno..."
          className="bg-white text-[#3A3A3A] focus:outline-none"
          style={{
            border: "1px solid #3A3A3A",
            borderRadius: 25,
            height: 48,
            padding: "0 20px",
            fontSize: 15,
            width: "min(360px, 100%)",
          }}
          aria-label="Buscar alumno por nombre"
        />

        <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
          <SelectorGrupoAsistencia
            grupos={grupos}
            grupoSeleccionadoId={grupoSeleccionadoId}
            fecha={fecha}
          />
          <SelectorFechaAsistencia fecha={fecha} />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "20px clamp(20px, 3vw, 48px) 40px" }}
      >
        {filtrados.length === 0 ? (
          <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
            {asistencias.length === 0
              ? "Este grupo no tiene alumnos."
              : "No se encontraron alumnos con ese nombre."}
          </p>
        ) : (
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div
              className="grid"
              style={{
                gridTemplateColumns: "1fr 160px 160px",
                padding: "0 20px",
                gap: 12,
              }}
            >
              <span className="text-[#8A8A8A]" style={{ fontSize: 13 }}>
                ALUMNO
              </span>
              <span className="text-[#8A8A8A]" style={{ fontSize: 13 }}>
                HORA DE LLEGADA
              </span>
              <span className="text-[#8A8A8A]" style={{ fontSize: 13 }}>
                ESTADO
              </span>
            </div>

            {filtrados.map((asistencia) => {
              const estilo = ESTILO_ESTADO[asistencia.estado];

              return (
                <div
                  key={asistencia.alumnoId}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "1fr 160px 160px",
                    gap: 12,
                    padding: "14px 20px",
                    borderRadius: 16,
                    background: estilo.fondo,
                  }}
                >
                  <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 16 }}>
                    {asistencia.nombre}
                  </span>
                  <span className="text-[#3A3A3A]" style={{ fontSize: 15 }}>
                    {formatHora(asistencia.primeraDeteccion)}
                  </span>
                  <span className="font-normal" style={{ fontSize: 15, color: estilo.texto }}>
                    {estilo.etiqueta}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
