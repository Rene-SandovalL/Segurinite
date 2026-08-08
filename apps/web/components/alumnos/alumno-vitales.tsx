"use client";

import { useState } from "react";
import type { DatosVitales } from "@/types/alumno";
import { useTelemetriaSocket } from "@/hooks/useTelemetriaSocket";

interface AlumnoVitalesProps {
  alumnoId: string;
  vitalesIniciales?: DatosVitales;
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
      className="flex flex-col items-center"
      style={{
        width: "90%",
        background: "#3A3A3A",
        borderRadius: 22,
        border: `4px solid ${colorBorde}`,
        padding: "10px 18px 16px",
        gap: 4,
      }}
    >
      <span className="text-white" style={{ fontSize: "clamp(16px, 1.8vw, 32px)" }}>
        {etiqueta}
      </span>
      <span className="text-white" style={{ fontSize: "clamp(26px, 3.5vw, 56px)" }}>
        {valor}
      </span>
    </div>
  );
}

export function AlumnoVitales({ alumnoId, vitalesIniciales }: AlumnoVitalesProps) {
  const [vitales, setVitales] = useState<DatosVitales | undefined>(vitalesIniciales);

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

  return (
    <div className="flex flex-col overflow-hidden flex-1" style={{ background: "#3A3A3A" }}>
      {/* Foto placeholder */}
      <div className="w-full shrink-0" style={{ height: "32%", background: "#D9D9D9" }} />

      {/* Área de vitales — scrollable */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center"
        style={{ padding: "10px 16px 20px", gap: 12 }}
      >
        <span
          className="text-white font-normal text-center"
          style={{ fontSize: "clamp(20px, 2.5vw, 38px)" }}
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
