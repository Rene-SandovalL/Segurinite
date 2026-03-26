"use client";

import { useRouter } from "next/navigation";

interface BotonAtrasProps {
  onClick?: () => void;
}

/**
 * Botón circular ← reutilizable.
 * Usa router.back() para regresar a la pantalla anterior.
 */
export function BotonAtras({ onClick }: BotonAtrasProps) {
  const enrutador = useRouter();

  return (
    <button
      onClick={onClick ?? (() => enrutador.back())}
      className="w-11 h-11 rounded-full bg-white border-none cursor-pointer flex items-center justify-center shrink-0 focus:outline-none"
      style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
      aria-label="Volver"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z"
          fill="#1D1B20"
        />
      </svg>
    </button>
  );
}
