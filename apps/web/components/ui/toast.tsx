"use client";

import { useEffect } from "react";

export interface ToastData {
  mensaje: string;
  /** Color del fondo del toast. Por defecto: #575EAA */
  color?: string;
  /** Duración en ms antes de auto-cerrar. Por defecto: 3000 */
  duracion?: number;
}

interface ToastNotificacionProps extends ToastData {
  onDismiss: () => void;
}

/**
 * Toast minimalista que aparece en la esquina inferior-derecha y
 * se cierra solo después de `duracion` ms.
 */
export function ToastNotificacion({
  mensaje,
  color = "#575EAA",
  duracion = 3000,
  onDismiss,
}: ToastNotificacionProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, duracion);
    return () => clearTimeout(id);
  }, [duracion, onDismiss]);

  return (
    <div
      className="fixed z-[9999] flex items-center gap-3 pointer-events-none"
      style={{
        bottom: 36,
        right: 40,
        background: color,
        borderRadius: 50,
        padding: "14px 28px",
        boxShadow: "0 6px 20px 0 rgba(0,0,0,0.25)",
        animation: "toast-in 0.25s ease",
      }}
    >
      {/* Ícono check */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13L9 17L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-white font-normal" style={{ fontSize: 18, whiteSpace: "nowrap" }}>
        {mensaje}
      </span>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
