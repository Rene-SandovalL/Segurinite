"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface AvatarEditableProps {
  fotoUrl: string | null | undefined;
  onSubir: (file: File) => Promise<void>;
  onEliminar: () => Promise<void>;
  /** "circulo": avatar redondo pequeño. "fondo": imagen a pantalla completa con degradado. */
  variante?: "circulo" | "fondo";
  /** Diámetro en px — solo aplica a la variante "circulo". */
  tamano?: number;
  alt?: string;
}

interface ItemMenuProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function ItemMenu({ children, onClick, disabled }: ItemMenuProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left text-[#3A3A3A]"
      style={{
        padding: "12px 18px",
        fontSize: 15,
        background: "transparent",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

/**
 * Avatar circular o de fondo completo con edición de foto (subir/reemplazar/eliminar).
 * Reutilizable para alumnos y docentes — ver .claude/rules/frontend.md.
 */
export function AvatarEditable({
  fotoUrl,
  onSubir,
  onEliminar,
  variante = "circulo",
  tamano = 150,
  alt = "Foto de perfil",
}: AvatarEditableProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const esFondo = variante === "fondo";

  useEffect(() => {
    if (!menuAbierto) {
      return;
    }

    function handleClickFuera(event: MouseEvent) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [menuAbierto]);

  async function handleEliminar() {
    setMenuAbierto(false);
    setEliminando(true);
    try {
      await onEliminar();
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div
      ref={contenedorRef}
      className="relative shrink-0"
      style={esFondo ? { width: "100%", height: "100%" } : { width: tamano, height: tamano }}
    >
      <div
        className={esFondo ? "relative w-full h-full" : "relative rounded-full w-full h-full overflow-hidden"}
        style={{ background: "#D9D9D9" }}
      >
        {fotoUrl && (
          <Image
            src={fotoUrl}
            alt={alt}
            fill
            sizes={esFondo ? "100vw" : `${tamano}px`}
            style={{ objectFit: "cover" }}
          />
        )}

        {esFondo && (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(58,58,58,0) 50%, #3A3A3A 100%)",
            }}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setMenuAbierto((valor) => !valor)}
        aria-label="Editar foto"
        className="absolute flex items-center justify-center"
        style={{
          bottom: esFondo ? 18 : -2,
          right: esFondo ? 18 : -2,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#575EAA",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      >
        <Camera size={18} color="#fff" />
      </button>

      {menuAbierto && (
        <div
          className="absolute z-20 bg-white rounded-2xl overflow-hidden"
          style={{
            bottom: esFondo ? 18 : -2,
            right: esFondo ? 68 : -2,
            transform: esFondo ? undefined : "translateY(calc(100% + 8px))",
            minWidth: 160,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          {!fotoUrl && (
            <ItemMenu
              onClick={() => {
                setMenuAbierto(false);
                setModalAbierto(true);
              }}
            >
              Nueva
            </ItemMenu>
          )}

          {fotoUrl && (
            <>
              <ItemMenu
                onClick={() => {
                  setMenuAbierto(false);
                  setModalAbierto(true);
                }}
              >
                Modificar
              </ItemMenu>
              <ItemMenu onClick={handleEliminar} disabled={eliminando}>
                {eliminando ? "Eliminando..." : "Eliminar"}
              </ItemMenu>
            </>
          )}
        </div>
      )}

      {modalAbierto && (
        <ModalSubirFoto
          titulo={fotoUrl ? "Modificar foto" : "Nueva foto"}
          onCancelar={() => setModalAbierto(false)}
          onGuardar={async (file) => {
            await onSubir(file);
            setModalAbierto(false);
          }}
        />
      )}
    </div>
  );
}

interface ModalSubirFotoProps {
  titulo: string;
  onCancelar: () => void;
  onGuardar: (file: File) => Promise<void>;
}

function ModalSubirFoto({ titulo, onCancelar, onGuardar }: ModalSubirFotoProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(archivo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setArchivo(event.target.files?.[0] ?? null);
    setError(null);
  }

  async function handleGuardar() {
    if (!archivo) {
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar(archivo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-foto-titulo"
    >
      <div
        className="w-full max-w-110 rounded-3xl bg-white"
        style={{ boxShadow: "0 18px 42px rgba(0,0,0,0.25)", padding: "26px 24px" }}
      >
        <h3
          id="modal-foto-titulo"
          className="text-[#2F2F2F] font-bold"
          style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}
        >
          {titulo}
        </h3>

        <div className="mt-5 flex flex-col items-center" style={{ gap: 14 }}>
          <div
            className="relative rounded-full overflow-hidden shrink-0"
            style={{ width: 140, height: 140, background: "#D9D9D9" }}
          >
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Vista previa"
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
            )}
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="text-sm text-[#4B4F5D]"
          />

          {error && (
            <p className="text-[#D75656]" style={{ fontSize: 14, margin: 0 }}>
              {error}
            </p>
          )}
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="h-11 rounded-xl px-5 border border-[#D8DBE8] bg-white text-[#4B4F5D] font-semibold"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando || !archivo}
            className="h-11 rounded-xl px-5 text-white font-semibold"
            style={{ background: guardando || !archivo ? "#A9ACD6" : "#575EAA" }}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
