"use client";

import {
  PULSERAS_CONECTADAS,
  PULSERAS_DISPONIBLES,
  type PulseraMock,
} from "@/lib/mock/pulseras";

/** Ícono de Bluetooth (SVG extraído del Figma) */
function IconoBluetooth() {
  return (
    <svg width="28" height="22" viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <path
        d="M8.66675 6.30303L23.3334 16.9697L16.0001 22.303V0.969696L23.3334 6.30303L8.66675 16.9697"
        stroke="#3A3A3A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ItemPulseraProps {
  pulsera: PulseraMock;
  onSeleccionar: (id: string) => void;
}

/** Ítem individual de pulsera: nombre + estado + ícono Bluetooth */
function ItemPulsera({ pulsera, onSeleccionar }: ItemPulseraProps) {
  const etiquetaEstado =
    pulsera.estado === "conectado" ? "Conectado" : "Disponible";

  return (
    <button
      onClick={() => onSeleccionar(pulsera.id)}
      className="w-full flex items-center justify-between bg-white rounded-[25px] border-none cursor-pointer focus:outline-none"
      style={{
        height: 56,
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        paddingLeft: 24,
        paddingRight: 20,
      }}
    >
      {/* Nombre y estado */}
      <div className="flex flex-col items-start">
        <span className="font-normal text-[#3A3A3A] leading-tight" style={{ fontSize: 20 }}>
          {pulsera.nombre}
        </span>
        <span className="font-normal text-[#AAA] leading-none" style={{ fontSize: 14 }}>
          {etiquetaEstado}
        </span>
      </div>

      {/* Ícono Bluetooth */}
      <IconoBluetooth />
    </button>
  );
}

interface SeccionPulserasProps {
  titulo: string;
  pulseras: PulseraMock[];
  onSeleccionar: (id: string) => void;
}

/** Sección con etiqueta + panel gris + grid de pulseras */
function SeccionPulseras({ titulo, pulseras, onSeleccionar }: SeccionPulserasProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-normal text-[#3A3A3A]" style={{ fontSize: "clamp(20px, 2.4vw, 32px)" }}>
        {titulo}
      </span>

      <div
        className="rounded-[25px] bg-[#D9D9D9]"
        style={{ minHeight: 80, padding: 16 }}
      >
        {pulseras.length === 0 ? (
          <p className="text-[#8A8A8A] text-center py-4" style={{ fontSize: 16 }}>
            No hay pulseras {titulo.toLowerCase()} en este momento.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {pulseras.map((p) => (
              <ItemPulsera key={p.id} pulsera={p} onSeleccionar={onSeleccionar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PulserasScannerProps {
  onVolver: () => void;
  onSeleccionarPulsera: (pulseraId: string) => void;
}

/**
 * Pantalla 2 del flujo de registro.
 * Muestra pulseras conectadas y disponibles (datos mock).
 * Al seleccionar una pulsera avanza a la Pantalla 3 (Formulario).
 */
export function PulserasScanner({ onVolver, onSeleccionarPulsera }: PulserasScannerProps) {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* ── Botón atrás ── */}
      <div className="shrink-0" style={{ padding: "28px 0 0 28px" }}>
        <button
          onClick={onVolver}
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
      </div>

      {/* ── Contenido scrollable ── */}
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{ padding: "clamp(16px, 2vw, 28px) clamp(20px, 3vw, 48px) clamp(20px, 3vw, 48px)", gap: "clamp(20px, 2.5vw, 36px)" }}
      >
        <SeccionPulseras
          titulo="Conexiónes"
          pulseras={PULSERAS_CONECTADAS}
          onSeleccionar={onSeleccionarPulsera}
        />

        <SeccionPulseras
          titulo="Disponibles"
          pulseras={PULSERAS_DISPONIBLES}
          onSeleccionar={onSeleccionarPulsera}
        />
      </div>
    </div>
  );
}
