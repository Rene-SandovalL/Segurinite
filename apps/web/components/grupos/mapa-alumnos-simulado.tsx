"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import {
  colorTextoSegunFondo,
  generarMarcadores,
  simularHeartRate,
  simularTemperatura,
} from "@/lib/simulacion/mapa-marcadores";
import { resolverColorHex } from "@/lib/mock/grupos";

interface MapaAlumnosSimuladoProps {
  grupoId: string;
  alumnos: AlumnoMock[];
  colorGrupo: string;
}

interface DetallesAlumnoHover {
  alumnoId: string;
  nombreCompleto: string;
  heartRate: number;
  temperatura: string;
  fueraDeRango: boolean;
}

function nombreAlumno(alumno: AlumnoMock): string {
  const nombre = alumno.nombreCompleto?.trim();
  if (nombre) {
    return nombre;
  }

  return `${alumno.nombre} ${alumno.apellido}`.trim();
}

export function MapaAlumnosSimulado({ grupoId, alumnos, colorGrupo }: MapaAlumnosSimuladoProps) {
  const marcadores = generarMarcadores(grupoId, alumnos);
  const [alumnoHoverId, setAlumnoHoverId] = useState<string | null>(null);

  const detallesPorAlumno = useMemo(() => {
    const detalles = new Map<string, DetallesAlumnoHover>();

    marcadores.forEach((marcador) => {
      detalles.set(marcador.alumno.id, {
        alumnoId: marcador.alumno.id,
        nombreCompleto: nombreAlumno(marcador.alumno),
        heartRate: simularHeartRate(grupoId, marcador.alumno.id, marcador.fueraDeRango),
        temperatura: simularTemperatura(grupoId, marcador.alumno.id, marcador.fueraDeRango),
        fueraDeRango: marcador.fueraDeRango,
      });
    });

    return detalles;
  }, [grupoId, marcadores]);

  const detallesHover = alumnoHoverId ? detallesPorAlumno.get(alumnoHoverId) ?? null : null;
  const fondoPanel = resolverColorHex(colorGrupo);
  const colorTextoPanel = colorTextoSegunFondo(fondoPanel);

  return (
    <div
      className="flex-1 overflow-hidden bg-white flex flex-col"
      style={{ borderRadius: "0 25px 25px 25px", paddingTop: 24, paddingInline: 10, paddingBottom: 10 }}
    >

      <div
        className="relative flex-1 overflow-hidden"
        style={{ borderRadius: 30, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", marginInline: 4, marginBottom: 4 }}
      >
        <Image
          src="/mapa.jpeg"
          alt="Mapa del grupo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {detallesHover && (
          <div
            className="absolute left-3 top-3 z-20 rounded-[14px]"
            style={{
              background: `${fondoPanel}CC`,
              color: colorTextoPanel,
              padding: "14px 16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.24)",
              width: "min(460px, calc(100% - 24px))",
              minHeight: 60,
            }}
          >
            <p
              className="font-bold"
              style={{
                fontSize: 18,
                lineHeight: 1.2,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span>{detallesHover.nombreCompleto}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                FC: {detallesHover.heartRate} bpm · Temp: {detallesHover.temperatura}°C
              </span>
            </p>
            <p style={{ fontSize: 14, marginTop: 6, opacity: 0.9 }}>
              {detallesHover.fueraDeRango ? "Estado simulado: alerta" : "Estado simulado: normal"}
            </p>
          </div>
        )}

        {marcadores.map((marcador) => {
          const colorBorde = marcador.fueraDeRango ? "#E56363" : "#3A3A3A";
          const sombra = marcador.fueraDeRango
            ? "0 0 4px 4px #FF6060"
            : "0 4px 4px 0 rgba(0,0,0,0.25)";

          return (
            <Link
              key={marcador.alumno.id}
              href={`/groups/${grupoId}/alumnos/${marcador.alumno.id}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${marcador.x}%`, top: `${marcador.y}%` }}
              aria-label={`Ver información de ${nombreAlumno(marcador.alumno)}`}
              onMouseEnter={() => setAlumnoHoverId(marcador.alumno.id)}
              onMouseLeave={() => setAlumnoHoverId((actual) => (actual === marcador.alumno.id ? null : actual))}
              onFocus={() => setAlumnoHoverId(marcador.alumno.id)}
              onBlur={() => setAlumnoHoverId((actual) => (actual === marcador.alumno.id ? null : actual))}
            >
              <span
                className="flex items-center justify-center rounded-full transition-all duration-200 ease-out w-6 h-6 group-hover:w-14 group-hover:h-14 group-focus-visible:w-14 group-focus-visible:h-14"
                style={{
                  background: "#575EAA",
                  border: `2px solid ${colorBorde}`,
                  boxShadow: sombra,
                }}
              >
                <span
                  className="text-white font-normal select-none pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  {marcador.alumno.iniciales}
                </span>
              </span>
            </Link>
          );
        })}

        {marcadores.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="bg-white/70 text-[#3A3A3A] rounded-[14px]"
              style={{ padding: "8px 14px", fontSize: 16 }}
            >
              Este grupo aún no tiene alumnos para mostrar en el mapa.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}