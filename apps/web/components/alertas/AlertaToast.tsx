"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Alerta } from "./AlertasProvider";

interface AlertaToastProps {
  alerta: Alerta;
  onDismiss: (id: string) => void;
}

export function AlertaToast({ alerta, onDismiss }: AlertaToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);

    window.setTimeout(() => {
      onDismiss(alerta.id);
    }, 220);
  };

  const rutaVer = alerta.grupoId
    ? `/groups/${alerta.grupoId}/mapa`
    : undefined;

  return (
    <article
      className="pointer-events-auto w-[min(410px,92vw)] rounded-2xl border border-[#E9E9E9] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.14)] transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(18px)",
      }}
    >
      <div className="flex">
        <div className="w-1.5 rounded-l-2xl bg-[#E64D4D]" />

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#C0392B] font-bold" style={{ fontSize: 16 }}>
                Alerta critica
              </p>
              <p className="text-[#2F2F2F] font-bold mt-0.5" style={{ fontSize: 16 }}>
                {alerta.alumnoNombre}
              </p>
            </div>

            <span className="text-[#8B8B8B]" style={{ fontSize: 12 }}>
              Ahora
            </span>
          </div>

          <p className="text-[#4B4B4B] mt-2" style={{ fontSize: 14 }}>
            {alerta.mensaje}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {rutaVer ? (
              <Link
                href={rutaVer}
                className="h-9 rounded-xl px-4 no-underline flex items-center justify-center bg-[#F3F5FF] text-[#575EAA] font-bold"
                style={{ fontSize: 13 }}
              >
                Ver
              </Link>
            ) : (
              <button
                type="button"
                className="h-9 rounded-xl px-4 border border-[#D7DAE6] text-[#575EAA] font-bold bg-white"
                style={{ fontSize: 13 }}
              >
                Ver
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="h-9 rounded-xl px-4 border border-[#E0E0E0] text-[#555555] font-bold bg-white"
              style={{ fontSize: 13 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
