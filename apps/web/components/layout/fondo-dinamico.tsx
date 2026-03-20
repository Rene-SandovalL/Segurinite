"use client";

import { usePathname } from "next/navigation";
import { COLOR_HEX, type GrupoMock } from "@/lib/mock/grupos";

interface FondoDinamicoProps {
  children: React.ReactNode;
  grupos: GrupoMock[];
}

/**
 * Envuelve el área principal del dashboard con el fondo de color dinámico.
 * Es un Client Component porque necesita usePathname() para detectar el grupo activo.
 */
export function FondoDinamico({ children, grupos }: FondoDinamicoProps) {
  const pathname = usePathname();
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoId = segmentos[2] ?? "";

  const grupo = grupos.find((g) => g.id === grupoId);
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
