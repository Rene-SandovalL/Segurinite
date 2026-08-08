"use client";

import { AlertasContainer } from "./AlertasContainer";

/**
 * Monta el contenedor de toasts de alertas.
 * La simulación (useSimuladorAlertas) se quitó — todavía no hay evaluación de
 * umbrales real que dispare alertas, eso es trabajo aparte. Cuando exista, se
 * conecta acá (vía el mismo WebSocket de telemetría u otro evento dedicado).
 */
export function AlertasBootstrap() {
  return <AlertasContainer />;
}
