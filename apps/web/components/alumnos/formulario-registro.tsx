"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Campo de texto
// ─────────────────────────────────────────────────────────────────────────────

interface CampoTextoProps {
  label: string;
  maxLength?: number;
  tipo?: "text" | "date";
  className?: string;
}

function CampoTexto({ label, maxLength, tipo = "text", className = "" }: CampoTextoProps) {
  const [valor, setValor] = useState("");
  const con_contador = maxLength !== undefined;

  return (
    <div className={`relative flex flex-col ${className}`} style={{ paddingTop: 10, paddingBottom: con_contador ? 22 : 0 }}>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        maxLength={maxLength}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none"
        style={{ border: "1px solid #3A3A3A", borderRadius: 25, height: 64, paddingLeft: 28, paddingRight: 28, fontSize: 18 }}
      />
      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{ top: 0, left: 20, fontSize: 18, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
      >
        {label}
      </span>
      {con_contador && (
        <span className="absolute right-3 text-[#3A3A3A] text-right" style={{ bottom: 2, fontSize: 14 }}>
          {String(valor.length).padStart(2, "0")} /{maxLength}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector de tipo de sangre
// ─────────────────────────────────────────────────────────────────────────────

const TIPOS_SANGRE = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function SelectorSangre({ className = "" }: { className?: string }) {
  const [valor, setValor] = useState("");

  return (
    <div className={`relative flex flex-col ${className}`} style={{ paddingTop: 10 }}>
      <select
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full bg-white text-[#3A3A3A] focus:outline-none appearance-none cursor-pointer"
        style={{ border: "1px solid #3A3A3A", borderRadius: 25, height: 64, paddingLeft: 28, paddingRight: 40, fontSize: 18 }}
      >
        <option value="" disabled />
        {TIPOS_SANGRE.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Etiqueta flotante */}
      <span
        className="absolute bg-white text-[#3A3A3A] pointer-events-none"
        style={{ top: 0, left: 20, fontSize: 18, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
      >
        Tipo de sangre
      </span>

      {/* Chevron */}
      <svg
        className="absolute pointer-events-none"
        style={{ right: 18, top: "50%", transform: "translateY(-50%) translateY(5px)" }}
        width="14" height="9" viewBox="0 0 14 9" fill="none"
      >
        <path d="M1 1L7 7L13 1" stroke="#3A3A3A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Encabezado de sección con separador
// ─────────────────────────────────────────────────────────────────────────────

function EncabezadoSeccion({ titulo }: { titulo: string }) {
  return (
    <div className="flex flex-col gap-1 mt-6 mb-4">
      <span className="text-[#3A3A3A] font-normal" style={{ fontSize: 20 }}>{titulo}</span>
      <div style={{ height: 1, background: "#3A3A3A" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bloque persona (tutor / contacto)
// ─────────────────────────────────────────────────────────────────────────────

function BloquePersona({ titulo }: { titulo: string }) {
  return (
    <>
      <EncabezadoSeccion titulo={titulo} />
      <div style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: 20 }}>
        <CampoTexto label="Nombre(s)" maxLength={16} />
        <CampoTexto label="Apellido(s)" maxLength={64} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 5fr", gap: 20, marginTop: 28 }}>
        <CampoTexto label="Num. Tel" maxLength={10} />
        <CampoTexto label="Direccion" />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Formulario completo
// ─────────────────────────────────────────────────────────────────────────────

interface FormularioRegistroProps {
  onVolver: () => void;
  onRegistrar?: () => void;
}

export function FormularioRegistro({ onVolver, onRegistrar }: FormularioRegistroProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(60);
  const [scrollVisible, setScrollVisible] = useState(false);

  // Calcula posición y tamaño del thumb
  const recalcularThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const trackHeight = clientHeight;
    const ratio = clientHeight / scrollHeight;
    const tH = Math.max(40, trackHeight * ratio);
    const tTop = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - tH);
    setThumbHeight(tH);
    setThumbTop(isNaN(tTop) ? 0 : tTop);
    setScrollVisible(scrollHeight > clientHeight);
  }, []);

  // Cálculo inicial al montar
  useEffect(() => { recalcularThumb(); }, [recalcularThumb]);

  // Arrastrar el thumb
  const onThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startScrollTop = scrollRef.current?.scrollTop ?? 0;

    const onMove = (ev: MouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollHeight, clientHeight } = el;
      const trackHeight = clientHeight;
      const tH = Math.max(40, trackHeight * (clientHeight / scrollHeight));
      const delta = ev.clientY - startY;
      const scrollDelta = (delta / (trackHeight - tH)) * (scrollHeight - clientHeight);
      el.scrollTop = Math.max(0, Math.min(scrollHeight - clientHeight, startScrollTop + scrollDelta));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* ── Cabecera ── */}
      <div
        className="shrink-0 relative flex items-center justify-center"
        style={{ padding: "28px 28px 20px" }}
      >
        <button
          onClick={onVolver}
          className="absolute left-7 top-1/2 -translate-y-1/2 rounded-full bg-white border-none cursor-pointer flex items-center justify-center focus:outline-none"
          style={{ width: 44, height: 44, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Volver"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L3 12L9 6L10.4 7.4L6.8 11H19V7H21V13H6.8L10.4 16.6L9 18Z" fill="#1D1B20" />
          </svg>
        </button>
        <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}>
          REGISTRAR INFORMACION
        </span>
      </div>

      {/* ── Área scrollable + barra lateral ── */}
      <div className="flex-1 overflow-hidden flex" style={{ padding: "0 clamp(20px, 3vw, 48px) 0", gap: 20 }}>

        {/* Contenido */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto sin-scrollbar"
          style={{ scrollbarWidth: "none" }}
          onScroll={recalcularThumb}
        >
          {/* — Datos personales — */}
          <EncabezadoSeccion titulo="Datos personales" />
          <div style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: 20 }}>
            <CampoTexto label="Nombre(s)" maxLength={16} />
            <CampoTexto label="Apellido(s)" maxLength={64} />
          </div>
          <div className="flex gap-5" style={{ marginTop: 28 }}>
            <CampoTexto label="Fecha de nacimiento" tipo="date" className="w-[200px]" />
            <SelectorSangre className="w-[180px]" />
          </div>

          <BloquePersona titulo="Datos del tutor (1)" />
          <BloquePersona titulo="Datos del tutor (2)" />
          <BloquePersona titulo="Contacto(s) de emergencia" />

          <div style={{ height: 80 }} />
        </div>

        {/* Barra de scroll personalizada */}
        {scrollVisible && (
          <div
            className="shrink-0 relative rounded-full"
            style={{ width: 16, background: "#8A8A8A" }}
          >
            <div
              className="absolute rounded-full cursor-pointer"
              style={{
                width: 16,
                height: thumbHeight,
                top: thumbTop,
                background: "#FFFFFF",
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
              onMouseDown={onThumbMouseDown}
            />
          </div>
        )}
      </div>

      {/* ── Botón Registrar ── */}
      <div
        className="shrink-0 flex justify-end"
        style={{ padding: "16px clamp(20px, 3vw, 48px) 24px" }}
      >
        <button
          onClick={onRegistrar}
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
          Registrar
        </button>
      </div>
    </div>
  );
}

