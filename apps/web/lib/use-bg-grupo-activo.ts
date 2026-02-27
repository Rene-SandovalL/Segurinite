"use client";

import { usePathname } from "next/navigation";
import { gruposMock } from "./mock-data";
import { coloresGrupo } from "./colores-grupo";
import type { ColorGrupo } from "../types/grupo";

/** Devuelve el hex de fondo del dashboard según el grupo activo en la URL. */
export function useBgGrupoActivo(): string {
  const pathname = usePathname();

  const grupoActivo = gruposMock.find((g) => pathname.includes(`/grupos/${g.id}`));
  const color: ColorGrupo = grupoActivo?.color ?? "morado";

  return coloresGrupo[color].hex;
}
