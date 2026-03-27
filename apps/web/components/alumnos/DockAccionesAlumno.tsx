"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DockAccionesAlumnoProps {
  visible: boolean;
  overId: string | null;
  colorActualizar: string;
}

interface DropzoneAccionProps {
  id: string;
  titulo: string;
  subtitulo: string;
  fondo: string;
  anillo: string;
  activa: boolean;
  alineacion: "izquierda" | "derecha";
  icono: ReactNode;
}

function DropzoneAccion({
  id,
  titulo,
  subtitulo,
  fondo,
  anillo,
  activa,
  alineacion,
  icono,
}: DropzoneAccionProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="relative rounded-[26px] border transition-all duration-300 ease-out"
      style={{
        height: "max(52vh, 360px)",
        width: "min(34vw, 480px)",
        background: activa ? fondo : "#FFFFFF",
        borderColor: activa ? "transparent" : "#DADDEB",
        boxShadow: activa ? anillo : "0 6px 20px rgba(0,0,0,0.08)",
        transform: activa ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
        opacity: activa ? 1 : 0.9,
      }}
    >
      <div
        className="h-full w-full px-7 py-6 flex flex-col justify-between"
        style={{
          alignItems: alineacion === "izquierda" ? "flex-start" : "flex-end",
          textAlign: alineacion === "izquierda" ? "left" : "right",
        }}
      >
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            background: activa ? "rgba(255,255,255,0.22)" : "#EEF1FB",
            color: activa ? "#FFFFFF" : "#3F4787",
          }}
        >
          {icono}
        </div>

        <div>
          <p className="font-bold" style={{ fontSize: 30, color: activa ? "#FFFFFF" : "#2F2F2F" }}>
            {titulo}
          </p>
          <p
            style={{
              marginTop: 8,
              fontSize: 17,
              lineHeight: 1.25,
              color: activa ? "rgba(255,255,255,0.92)" : "#61646F",
              maxWidth: 280,
            }}
          >
            {subtitulo}
          </p>
        </div>

        <p
          className="font-semibold"
          style={{
            fontSize: 14,
            color: activa ? "rgba(255,255,255,0.9)" : "#7A7E8A",
            letterSpacing: "0.01em",
          }}
        >
          SUELTA AQUI
        </p>
      </div>
    </div>
  );
}

function IconoEditar() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20H8L19 9C19.55 8.45 19.55 7.55 19 7L17 5C16.45 4.45 15.55 4.45 15 5L4 16V20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5L17.5 10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoQuitar() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 7L8 19C8.07 19.84 8.77 20.5 9.61 20.5H14.39C15.23 20.5 15.93 19.84 16 19L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M10 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DockAccionesAlumno({
  visible,
  overId,
  colorActualizar,
}: DockAccionesAlumnoProps) {
  return (
    <>
      <div
        className="fixed z-40 transition-all duration-300"
        style={{
          left: "calc(clamp(280px, 24vw, 463px) + clamp(16px, 3.5vw, 51px))",
          bottom: "clamp(20px, 3.2vh, 34px)",
          transform: visible ? "translateX(0)" : "translateX(-110%)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <DropzoneAccion
          id="dropzone-actualizar"
          titulo="Actualizar"
          subtitulo="Mueve la tarjeta aqui para abrir la edicion del alumno"
          fondo={`linear-gradient(135deg, ${colorActualizar} 0%, ${colorActualizar}E0 100%)`}
          anillo={`0 0 0 3px ${colorActualizar}55, 0 12px 28px ${colorActualizar}55`}
          activa={overId === "dropzone-actualizar"}
          alineacion="izquierda"
          icono={<IconoEditar />}
        />
      </div>

      <div
        className="fixed z-40 transition-all duration-300"
        style={{
          right: "clamp(12px, 2vw, 24px)",
          bottom: "clamp(20px, 3.2vh, 34px)",
          transform: visible ? "translateX(0)" : "translateX(110%)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <DropzoneAccion
          id="dropzone-quitar"
          titulo="Quitar"
          subtitulo="Suelta para quitar al alumno del grupo actual"
          fondo="linear-gradient(135deg, #D75656 0%, #E66A6A 100%)"
          anillo="0 0 0 3px rgba(215,86,86,0.28), 0 12px 28px rgba(215,86,86,0.26)"
          activa={overId === "dropzone-quitar"}
          alineacion="derecha"
          icono={<IconoQuitar />}
        />
      </div>

      <div
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 18% 85%, rgba(87,94,170,0.12), transparent 32%), radial-gradient(circle at 83% 85%, rgba(215,86,86,0.13), transparent 32%)",
        }}
      />
    </>
  );
}
