import type { ColorGrupo } from "../types/grupo";

/** Mapa centralizado de colores por grupo.
 *  `bg`   → clase Tailwind para fondos (cards, avatares, etc.)
 *  `hex`  → valor hex puro (útil para estilos inline, backgrounds del layout, etc.)
 */
export interface GrupoColorConfig {
  bg: string;   // Tailwind class, e.g. "bg-[#5c5ca8]"
  hex: string;  // raw hex, e.g. "#5c5ca8"
}

export const coloresGrupo: Record<ColorGrupo, GrupoColorConfig> = {
  morado:         { bg: "bg-[#5c5ca8]", hex: "#575EAA" },
  naranja:        { bg: "bg-[#e8692a]", hex: "#c85a24" },
  verde:          { bg: "bg-[#3a8a3a]", hex: "#357a35" },
  "verde-oscuro": { bg: "bg-[#2d5a5a]", hex: "#275050" },
};

/** Devuelve la config de color para un ColorGrupo, con fallback a morado. */
export function getColorConfig(color: ColorGrupo): GrupoColorConfig {
  return coloresGrupo[color] ?? coloresGrupo.morado;
}
