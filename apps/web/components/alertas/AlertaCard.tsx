"use client";

import { useState } from "react";
import {
  COLOR_ALERTA_SEVERIDAD,
  ETIQUETA_ALERTA_TIPO,
  type Alerta,
} from "@/types/alerta";

interface AlertaCardProps {
  alerta: Alerta;
  onResolver?: (id: string) => Promise<void>;
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

/**
 * Card de una alerta en el historial. Reutiliza el lenguaje de card claro
 * (fondo suave, borde redondeado) — las resueltas llevan una franja verde
 * (--color-resuelta) a la izquierda.
 */
export function AlertaCard({ alerta, onResolver }: AlertaCardProps) {
  const [resolviendo, setResolviendo] = useState(false);

  async function handleResolver() {
    if (!onResolver) {
      return;
    }

    setResolviendo(true);

    try {
      await onResolver(alerta.id);
    } finally {
      setResolviendo(false);
    }
  }

  return (
    <div
      className="flex items-stretch overflow-hidden"
      style={{
        borderRadius: 20,
        background: "#F5F5F5",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {alerta.resuelta && (
        <div className="shrink-0" style={{ width: 8, background: "var(--color-resuelta)" }} />
      )}

      <div
        className="flex-1 flex items-center justify-between flex-wrap"
        style={{ padding: "14px 22px", gap: 16 }}
      >
        <div>
          <span className="block text-[#8A8A8A]" style={{ fontSize: 13 }}>
            {formatearFecha(alerta.createdAt)}
          </span>

          <span className="block text-[#2F2F2F] font-bold" style={{ fontSize: 18 }}>
            {alerta.alumnoNombre}
            {alerta.grupoNombre && (
              <span className="font-normal text-[#8A8A8A]" style={{ fontSize: 14 }}>
                {" "}
                · {alerta.grupoNombre}
              </span>
            )}
          </span>

          <div className="flex items-center" style={{ gap: 8, marginTop: 2 }}>
            <span
              className="text-white font-normal"
              style={{
                fontSize: 12,
                padding: "2px 10px",
                borderRadius: 20,
                background: COLOR_ALERTA_SEVERIDAD[alerta.severidad],
              }}
            >
              {alerta.severidad}
            </span>
            <span className="text-[#4B4F5D]" style={{ fontSize: 14 }}>
              {ETIQUETA_ALERTA_TIPO[alerta.tipo]}
            </span>
          </div>

          {alerta.resuelta && alerta.resueltaPor && (
            <span
              className="block font-normal"
              style={{ fontSize: 13, color: "var(--color-resuelta)", marginTop: 4 }}
            >
              Resuelta por {alerta.resueltaPor.nombre} ({alerta.resueltaPor.rol})
            </span>
          )}
        </div>

        {!alerta.resuelta && onResolver && (
          <button
            type="button"
            onClick={() => void handleResolver()}
            disabled={resolviendo}
            className="shrink-0 h-10 rounded-xl px-5 text-white font-semibold border-none"
            style={{ background: resolviendo ? "#A9ACD6" : "var(--color-acento)" }}
          >
            {resolviendo ? "Resolviendo..." : "Resolver"}
          </button>
        )}
      </div>
    </div>
  );
}
