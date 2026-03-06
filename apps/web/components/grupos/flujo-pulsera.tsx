"use client";

import { useState } from "react";
import { AñadirPulsera } from "./añadir-pulsera";
import { GrupoHeader } from "./grupo-header";
import { PulserasScanner } from "@/components/alumnos/pulseras-scanner";
import { FormularioRegistro } from "@/components/alumnos/formulario-registro";

/** Pantallas disponibles dentro del flujo de añadir pulsera */
type PantallaFlujo =
  | { nombre: "selector" }
  | { nombre: "pulseras" }
  | { nombre: "nuevo-registro"; pulseraId: string }; // Pantalla 3 — por implementar

interface FlujoPulseraProps {
  grupoId: string;
}

/**
 * Componente cliente que gestiona el estado de navegación entre las
 * pantallas del flujo de añadir pulsera (dentro de la misma ruta).
 *
 * Pantalla 1 → Selector (Registro Existente / Nuevo Registro)
 * Pantalla 2 → Scanner de pulseras BLE (mock)
 * Pantalla 3 → Formulario de registro (por implementar)
 */
export function FlujoPulsera({ grupoId }: FlujoPulseraProps) {
  const [pantalla, setPantalla] = useState<PantallaFlujo>({ nombre: "selector" });

  const irAPulseras = () => setPantalla({ nombre: "pulseras" });
  const volverASelector = () => setPantalla({ nombre: "selector" });
  const volverAPulseras = () => setPantalla({ nombre: "pulseras" });

  const handleSeleccionarPulsera = (pulseraId: string) => {
    // TODO: avanzar a Pantalla 3 (Formulario de registro) cuando esté implementada
    setPantalla({ nombre: "nuevo-registro", pulseraId });
    console.log("Pulsera seleccionada:", pulseraId, "en grupo:", grupoId);
  };

  const tituloPantalla: Record<PantallaFlujo["nombre"], string> = {
    "selector": "AÑADIR PULSERA",
    "pulseras": "AÑADIR PULSERA/NUEVO REGISTRO",
    "nuevo-registro": "AÑADIR PULSERA/NUEVO REGISTRO",
  };

  return (
    <>
      <GrupoHeader titulo={tituloPantalla[pantalla.nombre]} />

      {/* Panel blanco — sin tabs, bordes redondeados en todas las esquinas */}
      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white" style={{ borderRadius: 25 }}>

      {pantalla.nombre === "selector" && (
        <AñadirPulsera
          onNuevoRegistro={irAPulseras}
          onRegistroExistente={() => {
            // TODO: avanzar a Pantalla 5 (Registros sin grupo) — por implementar
          }}
        />
      )}

      {pantalla.nombre === "pulseras" && (
        <PulserasScanner
          onVolver={volverASelector}
          onSeleccionarPulsera={handleSeleccionarPulsera}
        />
      )}

      {pantalla.nombre === "nuevo-registro" && (
        <FormularioRegistro
          onVolver={volverAPulseras}
          onRegistrar={() => {
            // TODO: avanzar a Pantalla 4 — Confirmación
            console.log("Registrar alumno con pulsera:", pantalla.pulseraId);
          }}
        />
      )}

        </div>
      </div>
    </>
  );
}
