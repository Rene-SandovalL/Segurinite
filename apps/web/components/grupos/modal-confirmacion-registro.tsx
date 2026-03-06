"use client";

interface ModalConfirmacionRegistroProps {
  onAgregarAlGrupo: () => void;
  onRegistrarOtro: () => void;
  onVolverAlGrupo: () => void;
}

/**
 * Modal de confirmación que aparece tras registrar un alumno.
 * Bloquea el fondo y presenta tres acciones posibles.
 */
export function ModalConfirmacionRegistro({
  onAgregarAlGrupo,
  onRegistrarOtro,
  onVolverAlGrupo,
}: ModalConfirmacionRegistroProps) {
  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.45)" }}
    >
      {/* ── Panel blanco ── */}
      <div
        className="flex flex-col items-center"
        style={{
          background: "#fff",
          borderRadius: 25,
          padding: "clamp(32px, 5vw, 56px) clamp(32px, 6vw, 72px)",
          width: "clamp(320px, 38vw, 520px)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.22)",
          gap: 0,
        }}
      >
        {/* Ícono de éxito */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#87D67B",
            boxShadow: "0 4px 12px 0 rgba(135,214,123,0.4)",
            marginBottom: 24,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13L9 17L19 7"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Título */}
        <span
          className="text-[#3A3A3A] font-normal text-center"
          style={{ fontSize: "clamp(22px, 2.5vw, 32px)", marginBottom: 8 }}
        >
          REGISTRO EXITOSO
        </span>

        {/* Subtítulo */}
        <span
          className="text-[#696969] font-normal text-center"
          style={{ fontSize: "clamp(15px, 1.4vw, 20px)", marginBottom: 36 }}
        >
          ¿Qué deseas hacer ahora?
        </span>

        {/* Botones de acción */}
        <div className="flex flex-col w-full" style={{ gap: 14 }}>
          <BotonModal
            label="AGREGAR AL GRUPO ACTUAL"
            color="#575EAA"
            textoColor="#fff"
            onClick={onAgregarAlGrupo}
          />
          <BotonModal
            label="REGISTRAR OTRO ALUMNO"
            color="#00BCD4"
            textoColor="#fff"
            onClick={onRegistrarOtro}
          />
          <BotonModal
            label="VOLVER AL GRUPO"
            color="#87D67B"
            textoColor="#3A3A3A"
            onClick={onVolverAlGrupo}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Botón interno del modal
// ─────────────────────────────────────────────────────────────────────────────

interface BotonModalProps {
  label: string;
  color: string;
  textoColor: string;
  onClick: () => void;
}

function BotonModal({ label, color, textoColor, onClick }: BotonModalProps) {
  return (
    <button
      onClick={onClick}
      className="w-full border-none cursor-pointer font-normal focus:outline-none"
      style={{
        background: color,
        color: textoColor,
        borderRadius: 25,
        height: 52,
        fontSize: "clamp(15px, 1.3vw, 20px)",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.15)",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </button>
  );
}
