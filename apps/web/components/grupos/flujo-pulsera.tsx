"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AñadirPulsera } from "./añadir-pulsera";
import { GrupoHeader } from "./grupo-header";
import { ModalConfirmacionRegistro } from "./modal-confirmacion-registro";
import { PulserasScanner } from "@/components/alumnos/pulseras-scanner";
import { FormularioRegistro } from "@/components/alumnos/formulario-registro";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";
import type { CreateAlumnoPayload } from "@/lib/api/segurinite";

/** Pantallas disponibles dentro del flujo de añadir pulsera */
type PantallaFlujo =
  | { nombre: "selector" }
  | { nombre: "pulseras" }
  | { nombre: "nuevo-registro"; pulseraId: string }
  | { nombre: "confirmacion"; pulseraId: string; alumnoId: string };

interface FlujoPulseraProps {
  grupoId: string;
}

export function FlujoPulsera({ grupoId }: FlujoPulseraProps) {
  const router = useRouter();
  const [pantalla, setPantalla] = useState<PantallaFlujo>({ nombre: "selector" });
  const [toast, setToast] = useState<ToastData | null>(null);

  const mostrarToast = useCallback((datos: ToastData) => {
    setToast(datos);
  }, []);

  const irAPulseras  = () => setPantalla({ nombre: "pulseras" });
  const volverASelector = () => setPantalla({ nombre: "selector" });
  const volverAPulseras = () => setPantalla({ nombre: "pulseras" });

  const handleSeleccionarPulsera = (pulseraId: string) => {
    setPantalla({ nombre: "nuevo-registro", pulseraId });
  };

  const handleRegistrar = (payload: Omit<CreateAlumnoPayload, "pulseraId">) => {
    void payload;

    if (pantalla.nombre !== "nuevo-registro") return;
    // TODO: llamar a la API y obtener el alumnoId real
    const nuevoAlumnoId = "nuevo";
    setPantalla({ nombre: "confirmacion", pulseraId: pantalla.pulseraId, alumnoId: nuevoAlumnoId });
  };

  // ── Acciones del modal ──────────────────────────────────────────────────────

  const handleAgregarAlGrupo = () => {
    if (pantalla.nombre !== "confirmacion") return;
    // TODO: llamar API para asignar alumno al grupo
    mostrarToast({ mensaje: "¡Registro exitoso! Alumno agregado al grupo.", color: "#575EAA" });
    setTimeout(() => router.push(`/groups/${grupoId}`), 2800);
  };

  const handleRegistrarOtro = () => {
    mostrarToast({
      mensaje: "¡Registro exitoso! Puedes asignar al alumno desde Registro existente.",
      color: "#00BCD4",
      duracion: 4500,
    });
    setPantalla({ nombre: "selector" });
  };

  const handleVolverAlGrupo = () => {
    mostrarToast({
      mensaje: "¡Registro exitoso! Puedes asignar al alumno desde Registro existente.",
      color: "#87D67B",
      duracion: 4500,
    });
    setTimeout(() => router.push(`/groups/${grupoId}`), 2800);
  };

  // ── Títulos por pantalla ────────────────────────────────────────────────────

  const tituloPantalla: Record<PantallaFlujo["nombre"], string> = {
    "selector":      "AÑADIR PULSERA",
    "pulseras":      "AÑADIR PULSERA/NUEVO REGISTRO",
    "nuevo-registro":"AÑADIR PULSERA/NUEVO REGISTRO",
    "confirmacion":  "AÑADIR PULSERA/NUEVO REGISTRO",
  };

  return (
    <>
      <GrupoHeader titulo={tituloPantalla[pantalla.nombre]} />

      {/* Panel blanco */}
      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white" style={{ borderRadius: 25 }}>

          {pantalla.nombre === "selector" && (
            <AñadirPulsera
              onNuevoRegistro={irAPulseras}
              onRegistroExistente={() => {
                // TODO: Pantalla 5 — Registros sin grupo
              }}
            />
          )}

          {pantalla.nombre === "pulseras" && (
            <PulserasScanner
              onVolver={volverASelector}
              onSeleccionarPulsera={handleSeleccionarPulsera}
            />
          )}

          {(pantalla.nombre === "nuevo-registro" || pantalla.nombre === "confirmacion") && (
            <FormularioRegistro
              onVolver={volverAPulseras}
              onRegistrar={handleRegistrar}
            />
          )}

        </div>
      </div>

      {/* Modal de confirmación — renderizado fuera del panel pero dentro del layout */}
      {pantalla.nombre === "confirmacion" && (
        <ModalConfirmacionRegistro
          onAgregarAlGrupo={handleAgregarAlGrupo}
          onRegistrarOtro={handleRegistrarOtro}
          onVolverAlGrupo={handleVolverAlGrupo}
        />
      )}

      {/* Toast */}
      {toast && (
        <ToastNotificacion
          {...toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}

