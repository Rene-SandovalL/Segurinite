"use client";

interface ModalConfirmacionQuitarProps {
  nombreAlumno: string;
  onCancelar: () => void;
  onConfirmar: () => void;
  procesando?: boolean;
}

export function ModalConfirmacionQuitar({
  nombreAlumno,
  onCancelar,
  onConfirmar,
  procesando = false,
}: ModalConfirmacionQuitarProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-quitar-titulo"
    >
      <div
        className="w-full max-w-130 rounded-3xl bg-white"
        style={{
          boxShadow: "0 18px 42px rgba(0,0,0,0.25)",
          padding: "26px 24px",
        }}
      >
        <h3
          id="modal-quitar-titulo"
          className="text-[#2F2F2F] font-bold"
          style={{ fontSize: "clamp(22px, 2.3vw, 32px)" }}
        >
          {`¿Quitar a ${nombreAlumno} del grupo?`}
        </h3>

        <p className="text-[#5E616C]" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.45 }}>
          Esta accion no elimina el registro del alumno; solo lo desasigna del grupo.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            className="h-11 rounded-xl px-5 border border-[#D8DBE8] bg-white text-[#4B4F5D] font-semibold"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            className="h-11 rounded-xl px-5 text-white font-semibold"
            style={{
              background: procesando
                ? "#E6A6A6"
                : "linear-gradient(135deg, #D75656 0%, #E66A6A 100%)",
            }}
          >
            {procesando ? "Quitando..." : "Quitar"}
          </button>
        </div>
      </div>
    </div>
  );
}
