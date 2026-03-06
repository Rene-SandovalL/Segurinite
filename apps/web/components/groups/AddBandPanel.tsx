import Image from "next/image";

interface AddBandPanelProps {
  onBack: () => void;
  onExistingRecord: () => void;
  onNewRecord: () => void;
}

/**
 * Panel "AÑADIR PULSERA" — se muestra al pulsar el botón + de la pestaña Integrantes.
 * Ofrece dos opciones: Registro Existente o Nuevo Registro.
 */
export default function AddBandPanel({
  onBack,
  onExistingRecord,
  onNewRecord,
}: AddBandPanelProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#FFFFFF",
        borderRadius: 25,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Back button ─────────────────────────────────────── */}
      <div style={{ padding: "22px 28px 0", flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            flexShrink: 0,
          }}
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

      {/* ── Subtitle ────────────────────────────────────────── */}
      <div
        style={{
          textAlign: "center",
          color: "#696969",
          fontFamily: "Lato, sans-serif",
          fontSize: "clamp(18px, 2vw, 32px)",
          fontWeight: 400,
          padding: "clamp(16px, 3vh, 28px) 0 clamp(20px, 3.5vh, 36px)",
          flexShrink: 0,
        }}
      >
        Añadir pulsera a partir de...
      </div>

      {/* ── Two option buttons ──────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "clamp(24px, 4vw, 69px)",
          padding: "0 clamp(24px, 5vw, 80px) clamp(24px, 5vh, 48px)",
          minHeight: 0,
        }}
      >
        {/* REGISTRO EXISTENTE */}
        <button
          onClick={onExistingRecord}
          style={{
            flex: "0 1 436px",
            maxWidth: 436,
            borderRadius: 25,
            border: "none",
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            background: "#FFFFFF",
            padding: 0,
          }}
          aria-label="Registro existente"
        >
          {/* Header strip */}
          <div
            style={{
              background: "#6AE89D",
              width: "100%",
              flexShrink: 0,
              padding: "clamp(16px, 3vh, 35px) 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Lato, sans-serif",
                fontSize: "clamp(16px, 1.8vw, 32px)",
                fontWeight: 400,
              }}
            >
              REGISTRO EXISTENTE
            </span>
          </div>

          {/* Icon area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(16px, 3vh, 32px)",
              minHeight: 0,
            }}
          >
            <div style={{ position: "relative", width: "70%", aspectRatio: "1/1", maxWidth: 260 }}>
              <Image
                src="/icons/registro_existente_icon.png"
                alt="Registro existente"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </button>

        {/* NUEVO REGISTRO */}
        <button
          onClick={onNewRecord}
          style={{
            flex: "0 1 436px",
            maxWidth: 436,
            borderRadius: 25,
            border: "none",
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            background: "#FFFFFF",
            padding: 0,
          }}
          aria-label="Nuevo registro"
        >
          {/* Header strip */}
          <div
            style={{
              background: "#00BCD4",
              width: "100%",
              flexShrink: 0,
              padding: "clamp(16px, 3vh, 35px) 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Lato, sans-serif",
                fontSize: "clamp(16px, 1.8vw, 32px)",
                fontWeight: 400,
              }}
            >
              NUEVO REGISTRO
            </span>
          </div>

          {/* Icon area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(16px, 3vh, 32px)",
              minHeight: 0,
            }}
          >
            <div style={{ position: "relative", width: "70%", aspectRatio: "1/1", maxWidth: 260 }}>
              <Image
                src="/icons/nuevo_registro_icon.png"
                alt="Nuevo registro"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
