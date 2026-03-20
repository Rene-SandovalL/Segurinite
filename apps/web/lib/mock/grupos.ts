import type { Grupo } from "@/types/grupo";

export type GrupoColor = string;

const COLOR_HEX_BASE: Record<string, string> = {
  blue: "#575EAA",
  coral: "#FF7043",
  green: "#2E7D32",
  grey: "#37474F",
};

export const COLOR_FONDO_PREDETERMINADO = "#575EAA";

export function resolverColorHex(color: string | undefined | null): string {
  if (!color) {
    return COLOR_FONDO_PREDETERMINADO;
  }

  const valor = color.trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(valor)) {
    return valor.toUpperCase();
  }

  return COLOR_HEX_BASE[valor] ?? COLOR_FONDO_PREDETERMINADO;
}

export interface GrupoMock extends Omit<Grupo, "color"> {
  color: GrupoColor;
  iconText: string;
  /** cantidad de miembros para las burbujas representativas */
  bubbles: number;
}

export const GRUPOS_MOCK: GrupoMock[] = [
  { id: "1", nombre: "GRUPO 4-A", color: "#575EAA", iconText: "G", totalAlumnos: 12, bubbles: 6 },
  { id: "2", nombre: "GRUPO 2-B", color: "#FF7043", iconText: "G", totalAlumnos: 10, bubbles: 6 },
  { id: "3", nombre: "GRUPO 1-A", color: "#2E7D32", iconText: "G", totalAlumnos: 9, bubbles: 6 },
  { id: "4", nombre: "GRUPO 1-B", color: "#37474F", iconText: "G", totalAlumnos: 8, bubbles: 6 },
];
