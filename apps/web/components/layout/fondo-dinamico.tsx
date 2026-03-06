"use client";

import { usePathname } from "next/navigation";
import { GRUPOS_MOCK, COLOR_HEX } from "@/lib/mock/grupos";

/**
 * Envuelve el área principal del dashboard con el fondo de color dinámico.
 * Es un Client Component porque necesita usePathname() para detectar el grupo activo.
 */
export function FondoDinamico({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoId = segmentos[2] ?? "";

  const grupo = GRUPOS_MOCK.find((g) => g.id === grupoId);
  const colorFondo = grupo ? COLOR_HEX[grupo.color] : COLOR_HEX.blue;

  return (
    <main className="relative flex-1 h-full overflow-hidden flex flex-col">
      {/* Fondo del color del grupo — cubre todo el panel */}
      <div className="absolute inset-0" style={{ background: colorFondo }} />

      {/* Contenido sobre el fondo */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </main>
  );
}
