"use client";

import { useState } from "react";
import type { DatosVitales } from "@/types/alumno";
import { useTelemetriaSocket } from "@/hooks/useTelemetriaSocket";
import { apiFetch } from "@/lib/api/client";
import { AvatarEditable } from "@/components/ui/avatar-editable";

interface AlumnoVitalesProps {
  alumnoId: string;
  vitalesIniciales?: DatosVitales;
  fotoUrlInicial?: string;
}

interface TarjetaVitalProps {
  etiqueta: string;
  valor: string;
  colorBorde: string;
}

/**
 * Panel derecho del detalle del alumno.
 * Muestra foto placeholder y tarjetas de datos vitales, en vivo vía WebSocket.
 */
function TarjetaVital({ etiqueta, valor, colorBorde }: TarjetaVitalProps) {
  return (
    <div
      className="flex flex-col items-center shrink-0"
      style={{
        width: "90%",
        background: "#3A3A3A",
        borderRadius: 22,
        border: `4px solid ${colorBorde}`,
        padding: "clamp(4px, 1vh, 10px) 18px clamp(6px, 1.4vh, 14px)",
        gap: 2,
      }}
    >
      <span className="text-white" style={{ fontSize: "clamp(14px, 1.6vw, 26px)" }}>
        {etiqueta}
      </span>
      <span className="text-white" style={{ fontSize: "clamp(20px, 2.8vw, 42px)" }}>
        {valor}
      </span>
    </div>
  );
}

export function AlumnoVitales({
  alumnoId,
  vitalesIniciales,
  fotoUrlInicial,
}: AlumnoVitalesProps) {
  const [vitales, setVitales] = useState<DatosVitales | undefined>(vitalesIniciales);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(fotoUrlInicial);

  useTelemetriaSocket((evento) => {
    if (evento.alumnoId !== alumnoId) {
      return;
    }

    setVitales({
      spo2: evento.spo2,
      pulso: evento.bpm,
      temperatura: evento.temp,
      ultimaLectura: "Hace unos segundos",
    });
  });

  async function handleSubirFoto(file: File) {
    const formData = new FormData();
    formData.append("archivo", file);

    const { fotoUrl: nuevaFotoUrl } = await apiFetch<{ fotoUrl: string }>(
      `/alumnos/${alumnoId}/foto`,
      { method: "POST", body: formData },
    );

    setFotoUrl(nuevaFotoUrl);
  }

  async function handleEliminarFoto() {
    await apiFetch<{ fotoUrl: null }>(`/alumnos/${alumnoId}/foto`, {
      method: "DELETE",
    });

    setFotoUrl(undefined);
  }

  return (
    <div className="flex flex-col overflow-hidden flex-1" style={{ background: "#3A3A3A" }}>
      {/* Foto de perfil — imagen completa con degradado hacia el bloque de vitales */}
      <div className="w-full shrink-0" style={{ height: "30%" }}>
        <AvatarEditable
          variante="fondo"
          fotoUrl={fotoUrl}
          onSubir={handleSubirFoto}
          onEliminar={handleEliminarFoto}
          alt="Foto del alumno"
        />
      </div>

      {/* Área de vitales */}
      <div
        className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center"
        style={{ padding: "clamp(6px, 1.5vh, 16px) 16px", gap: "clamp(6px, 1.8vh, 14px)" }}
      >
        <span
          className="text-white font-normal text-center"
          style={{ fontSize: "clamp(18px, 2.2vw, 32px)" }}
        >
          Datos Vitales
        </span>

        <TarjetaVital
          etiqueta="SpO2"
          valor={vitales?.spo2 != null ? `${vitales.spo2}%` : "—"}
          colorBorde="#87D67B"
        />
        <TarjetaVital
          etiqueta="Pulso"
          valor={vitales?.pulso != null ? `${vitales.pulso} bpm` : "—"}
          colorBorde="#FF7043"
        />
        <TarjetaVital
          etiqueta="Temperatura"
          valor={vitales?.temperatura != null ? `${vitales.temperatura} °C` : "—"}
          colorBorde="#575EAA"
        />
      </div>
    </div>
  );
}
