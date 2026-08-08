"use client";

import { GrupoHeader } from "@/components/grupos/grupo-header";
import { BotonAtras } from "@/components/ui/boton-atras";
import { BeaconsFormulario } from "./beacons-formulario";
import { DispositivosMenu } from "./dispositivos-menu";
import { PulserasFormulario } from "./pulseras-formulario";

export type VistaDispositivos = "menu" | "pulseras" | "beacons";

const TITULOS: Record<VistaDispositivos, string> = {
  menu: "DISPOSITIVOS",
  pulseras: "DISPOSITIVOS/PULSERAS",
  beacons: "DISPOSITIVOS/BEACONS",
};

interface DispositivosPanelProps {
  vista: VistaDispositivos;
  onCambiarVista: (vista: VistaDispositivos) => void;
  onSalir: () => void;
}

/**
 * Reemplaza el contenido de la zona blanca principal (dentro de FondoDinamico)
 * con el flujo de configuración de dispositivos físicos: menú de selección,
 * luego el formulario de pulseras o de beacons.
 */
export function DispositivosPanel({ vista, onCambiarVista, onSalir }: DispositivosPanelProps) {
  return (
    <>
      <GrupoHeader titulo={TITULOS[vista]} />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white overflow-hidden flex flex-col" style={{ borderRadius: 25 }}>
          <div className="shrink-0" style={{ padding: "28px 0 0 28px" }}>
            <BotonAtras onClick={vista === "menu" ? onSalir : () => onCambiarVista("menu")} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {vista === "menu" && (
              <DispositivosMenu
                onSeleccionarPulseras={() => onCambiarVista("pulseras")}
                onSeleccionarBeacons={() => onCambiarVista("beacons")}
              />
            )}

            {vista === "pulseras" && <PulserasFormulario />}
            {vista === "beacons" && <BeaconsFormulario />}
          </div>
        </div>
      </div>
    </>
  );
}
