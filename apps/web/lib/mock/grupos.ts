import type { Grupo } from "@/types/grupo";

export type GrupoColor = "blue" | "coral" | "green" | "grey";

export const COLOR_HEX: Record<GrupoColor, string> = {
  blue: "#575EAA",
  coral: "#FF7043",
  green: "#2E7D32",
  grey: "#37474F",
};

export interface GrupoMock extends Omit<Grupo, "color"> {
  color: GrupoColor;
  iconText: string;
  /** cantidad de miembros para las burbujas representativas */
  bubbles: number;
}

export const GRUPOS_MOCK: GrupoMock[] = [
  { id: "1", nombre: "GRUPO 4-A", color: "blue",  iconText: "G", totalAlumnos: 12, bubbles: 6 },
  { id: "2", nombre: "GRUPO 2-B", color: "coral", iconText: "G", totalAlumnos: 10, bubbles: 6 },
  { id: "3", nombre: "GRUPO 1-A", color: "green", iconText: "G", totalAlumnos: 9,  bubbles: 6 },
  { id: "4", nombre: "GRUPO 1-B", color: "grey",  iconText: "G", totalAlumnos: 8,  bubbles: 6 },
];
