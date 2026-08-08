"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { crearMapa } from "@/lib/api/segurinite";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

export function SubirMapa() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  async function handleSubirMapa() {
    setMensajeError(null);

    if (!nombre.trim()) {
      setMensajeError("El nombre del mapa es obligatorio");
      return;
    }

    if (!archivo) {
      setMensajeError("Selecciona una imagen del mapa");
      return;
    }

    setSubiendo(true);

    try {
      const mapa = await crearMapa({ nombre: nombre.trim(), archivo });
      setToast({ mensaje: "Mapa subido correctamente", color: "#87D67B" });
      setTimeout(() => {
        router.push(`/admin/mapas/${mapa.id}`);
        router.refresh();
      }, 650);
    } catch (error) {
      setMensajeError(
        error instanceof Error ? error.message : "No se pudo subir el mapa",
      );
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div
        className="shrink-0"
        style={{ padding: "clamp(24px, 3vw, 48px) clamp(32px, 6vw, 108px) 0" }}
      >
        <h2 className="text-[#3A3A3A] font-normal" style={{ fontSize: 24, paddingBottom: 18 }}>
          Subir nuevo mapa
        </h2>
        <div style={{ height: 1, background: "#3A3A3A" }} />
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "18px clamp(32px, 6vw, 108px) 40px" }}
      >
        <div
          className="relative w-full"
          style={{ maxWidth: "clamp(300px, 44vw, 594px)", paddingBottom: 18, paddingTop: 10 }}
        >
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={60}
            className="w-full bg-white text-[#3A3A3A] focus:outline-none"
            style={{
              border: "1px solid #3A3A3A",
              borderRadius: 25,
              height: 64,
              paddingLeft: 28,
              paddingRight: 28,
              fontSize: 18,
            }}
          />
          <span
            className="absolute bg-white text-[#3A3A3A] pointer-events-none"
            style={{ top: 0, left: 20, fontSize: 18, lineHeight: "20px", paddingLeft: 4, paddingRight: 4 }}
          >
            Nombre del mapa
          </span>
        </div>

        <div style={{ maxWidth: "clamp(300px, 44vw, 594px)", paddingBottom: 18 }}>
          <label
            className="flex items-center cursor-pointer text-[#3A3A3A]"
            style={{
              border: "1px solid #3A3A3A",
              borderRadius: 25,
              height: 64,
              paddingLeft: 28,
              paddingRight: 28,
              fontSize: 18,
            }}
          >
            {archivo ? archivo.name : "Elegir imagen del mapa (PNG, JPEG o WEBP)"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {mensajeError && (
          <p className="text-[#E66363]" style={{ fontSize: 16 }}>
            {mensajeError}
          </p>
        )}

        <div style={{ paddingTop: 12 }}>
          <button
            onClick={() => void handleSubirMapa()}
            disabled={subiendo}
            className="border-none cursor-pointer font-normal text-[#3A3A3A] focus:outline-none"
            style={{
              background: subiendo ? "#B8DDB1" : "#87D67B",
              borderRadius: 25,
              height: 52,
              width: "clamp(200px, 25vw, 349px)",
              fontSize: "clamp(18px, 1.5vw, 24px)",
              boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            }}
            type="button"
          >
            {subiendo ? "Subiendo..." : "Subir mapa"}
          </button>
        </div>
      </div>

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
