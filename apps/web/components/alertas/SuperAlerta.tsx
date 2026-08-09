"use client";

import { ETIQUETA_ALERTA_TIPO, type AlertaSeveridad, type AlertaTipo } from "@/types/alerta";

interface SuperAlertaProps {
  alumnoNombre: string;
  grupoNombre?: string;
  tipo: AlertaTipo;
  severidad: AlertaSeveridad;
  onCerrar: () => void;
}

/**
 * Overlay crítico a pantalla completa — se dispara SOLO cuando llega un
 * evento de WebSocket con esCritica: true (TEMP_ANOMALA o SIN_SENAL).
 * Cerrarla solo la quita de pantalla; la alerta sigue "sin resolver" en el
 * historial hasta que alguien la resuelva ahí explícitamente.
 */
export function SuperAlerta({
  alumnoNombre,
  grupoNombre,
  tipo,
  severidad,
  onCerrar,
}: SuperAlertaProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 200,
        background: "rgba(30, 0, 0, 0.75)",
        animation: "super-alerta-fondo 1.2s ease-in-out infinite",
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="super-alerta-titulo"
    >
      <div
        className="w-full max-w-160 flex flex-col items-center text-center"
        style={{
          background: "#FFFFFF",
          borderRadius: 32,
          padding: "clamp(28px, 4vw, 56px)",
          border: "6px solid #E56363",
          boxShadow: "0 0 0 8px rgba(229,99,99,0.25), 0 20px 60px rgba(0,0,0,0.45)",
          animation: "super-alerta-borde 1.2s ease-in-out infinite",
        }}
      >
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
            stroke="#E56363"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          id="super-alerta-titulo"
          className="font-bold"
          style={{ color: "#C0392B", fontSize: "clamp(24px, 3.2vw, 40px)", marginTop: 12 }}
        >
          ALERTA CRÍTICA
        </span>

        <span
          className="font-bold"
          style={{ color: "#2F2F2F", fontSize: "clamp(28px, 4vw, 52px)", marginTop: 16 }}
        >
          {alumnoNombre}
        </span>

        {grupoNombre && (
          <span
            className="font-normal"
            style={{ color: "#8A8A8A", fontSize: "clamp(16px, 1.8vw, 22px)", marginTop: 2 }}
          >
            {grupoNombre}
          </span>
        )}

        <span
          className="font-normal"
          style={{ color: "#4B4F5D", fontSize: "clamp(18px, 2.2vw, 26px)", marginTop: 8 }}
        >
          {ETIQUETA_ALERTA_TIPO[tipo]} · {severidad}
        </span>

        <button
          type="button"
          onClick={onCerrar}
          className="font-semibold text-white border-none"
          style={{
            marginTop: 32,
            height: 52,
            padding: "0 32px",
            borderRadius: 26,
            background: "#575EAA",
            fontSize: 18,
          }}
        >
          Cerrar
        </button>
      </div>

      <style>{`
        @keyframes super-alerta-fondo {
          0%, 100% { background-color: rgba(30, 0, 0, 0.75); }
          50% { background-color: rgba(60, 0, 0, 0.85); }
        }
        @keyframes super-alerta-borde {
          0%, 100% { box-shadow: 0 0 0 8px rgba(229,99,99,0.25), 0 20px 60px rgba(0,0,0,0.45); }
          50% { box-shadow: 0 0 0 16px rgba(229,99,99,0.4), 0 20px 60px rgba(0,0,0,0.45); }
        }
      `}</style>
    </div>
  );
}
