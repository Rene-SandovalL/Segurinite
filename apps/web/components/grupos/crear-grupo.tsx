"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Paleta de colores disponibles para el grupo
// ─────────────────────────────────────────────────────────────────────────────

const COLORES_GRUPO: Array<string | null> = [
  null,       // sin color (gris por defecto)
  "#575EAA",  // morado
  "#2E7D32",  // verde oscuro
  "#F44336",  // rojo
  "#00BCD4",  // cyan
  "#FF7043",  // naranja
  "#E91E8C",  // rosa
];

// ─────────────────────────────────────────────────────────────────────────────
// Selector de color
// ─────────────────────────────────────────────────────────────────────────────

interface SelectorColorProps {
  valor: string | null;
  onChange: (color: string | null) => void;
}

function SelectorColor({ valor, onChange }: SelectorColorProps) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const fondoCerrado = valor ?? "#D9D9D9";

  // 7 swatches × 52px + 6 gaps × 8px + padding 8×2 = 428px
  const ANCHO_ABIERTO = COLORES_GRUPO.length * 52 + (COLORES_GRUPO.length - 1) * 8 + 16;
  const ANCHO_CERRADO = 200;

  useEffect(() => {
    if (!abierto) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [abierto]);

  const handleSeleccionar = (color: string | null) => {
    onChange(color);
    setAbierto(false);
  };

  return (
    <div
      ref={contenedorRef}
      className="relative flex items-center justify-center"
      style={{
        width: abierto ? ANCHO_ABIERTO : ANCHO_CERRADO,
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        marginTop: 14,
      }}
    >
      {/* Etiqueta flotante sobre el borde superior */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center"
        style={{
          top: -26,
          background: abierto ? "#3A3A3A" : fondoCerrado,
          border: "1px solid #3A3A3A",
          borderBottom: "none",
          borderRadius: "6px 6px 0 0",
          padding: "1px 16px 0",
          whiteSpace: "nowrap",
          transition: "background 0.3s ease",
          zIndex: 1,
        }}
      >
        <span
          className="font-normal"
          style={{
            fontSize: 18,
            color: abierto ? "#fff" : "#3A3A3A",
            transition: "color 0.3s ease",
          }}
        >
          Color
        </span>
      </div>

      {/* Caja expandible horizontalmente */}
      <div
        role="button"
        aria-expanded={abierto}
        onClick={!abierto ? () => setAbierto(true) : undefined}
        className="flex items-center w-full"
        style={{
          height: 64,
          background: abierto ? "#3A3A3A" : fondoCerrado,
          border: "1px solid #3A3A3A",
          borderRadius: 10,
          transition: "background 0.3s ease",
          cursor: abierto ? "default" : "pointer",
          padding: "0 8px",
          gap: abierto ? 8 : 0,
          boxSizing: "border-box",
          justifyContent: "center",
        }}
      >
        {COLORES_GRUPO.map((color, i) => (
          <button
            key={i}
            aria-label={color ?? "Sin color"}
            onClick={(e) => {
              e.stopPropagation();
              if (abierto) handleSeleccionar(color);
            }}
            style={{
              flexShrink: 0,
              width: abierto ? 52 : 0,
              height: abierto ? 52 : 0,
              background: color ?? "#D9D9D9",
              border: color === valor ? "3px solid #fff" : "2px solid transparent",
              borderRadius: 6,
              cursor: abierto ? "pointer" : "default",
              outline: color === valor ? "2px solid #D9D9D9" : "none",
              opacity: abierto ? 1 : 0,
              padding: 0,
              transition: "width 0.3s ease, height 0.3s ease, opacity 0.2s ease 0.1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export function CrearGrupo() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState<string | null>(null);

  const handleCrear = () => {
    // TODO: llamar API para crear grupo
    console.log("Crear grupo:", { nombre, color });
    router.push("/groups");
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* ── Cabecera ── */}
      <div
        className="shrink-0 flex items-center gap-5"
        style={{ padding: "28px 28px 20px" }}
      >
        <button
          onClick={() => router.back()}
          className="rounded-full bg-white border-none cursor-pointer flex items-center justify-center shrink-0 focus:outline-none"
          style={{ width: 44, height: 44, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Volver"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z" fill="#1D1B20" />
          </svg>
        </button>
        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}>
          CREAR NUEVO GRUPO
        </span>
      </div>

      {/* ── Contenido ── */}
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "0 clamp(32px, 6vw, 108px) 0" }}>

        {/* — Datos generales — */}
        <div className="flex flex-col" style={{ gap: 2, marginBottom: 32 }}>
          <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
            Datos generales
          </span>
          <div style={{ height: 1, background: "#3A3A3A" }} />
        </div>

        {/* Campos centrados */}
        <div className="flex flex-col items-center" style={{ gap: 36, marginBottom: 48 }}>

          {/* Nombre del grupo */}
          <div
            className="relative w-full"
            style={{ maxWidth: "clamp(300px, 44vw, 594px)", paddingBottom: 22, paddingTop: 10 }}
          >
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={64}
              className="w-full bg-white text-[#3A3A3A] focus:outline-none"
              style={{ border: "1px solid #3A3A3A", borderRadius: 25, height: 64, paddingLeft: 28, paddingRight: 28, fontSize: 18 }}
            />
            <span
              className="absolute bg-white text-[#3A3A3A] pointer-events-none"
              style={{ top: 0, left: 20, fontSize: 18, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
            >
              Nombre del grupo
            </span>
            <span className="absolute right-3 text-[#3A3A3A] text-right" style={{ bottom: 2, fontSize: 14 }}>
              {String(nombre.length).padStart(2, "0")} /64
            </span>
          </div>

          {/* Selector de color */}
          <SelectorColor valor={color} onChange={setColor} />
        </div>

        {/* — Integrantes — */}
        <div className="flex items-baseline gap-3" style={{ marginBottom: 8 }}>
          <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 24 }}>
            Integrantes
          </span>
          <span className="text-[#8A8A8A] font-normal" style={{ fontSize: 16 }}>
            (Nota: Un grupo debe contener al menos un (1) integrante)
          </span>
        </div>
        <div style={{ height: 1, background: "#3A3A3A", marginBottom: 28 }} />

        {/* Botón + */}
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <button
            className="border-none cursor-pointer text-[#3A3A3A] font-normal focus:outline-none"
            style={{
              background: "#D9D9D9",
              borderRadius: 25,
              height: 64,
              width: "clamp(220px, 28vw, 349px)",
              fontSize: 36,
              boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            }}
            aria-label="Agregar integrante"
          >
            +
          </button>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* ── Botón Crear grupo ── */}
      <div
        className="shrink-0 flex justify-end"
        style={{ padding: "16px clamp(24px, 4vw, 60px) 28px" }}
      >
        <button
          onClick={handleCrear}
          className="border-none cursor-pointer font-normal text-[#3A3A3A] focus:outline-none"
          style={{
            background: "#87D67B",
            borderRadius: 25,
            height: 52,
            width: "clamp(200px, 25vw, 349px)",
            fontSize: "clamp(18px, 1.5vw, 24px)",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
          }}
        >
          Crear grupo
        </button>
      </div>

    </div>
  );
}
