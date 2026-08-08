export type TipoZona = "SALON" | "AREA_COMUN" | "ENTRADA" | "OTRO";

export interface Zona {
  id: number;
  nombre: string;
  tipo: TipoZona;
  grupo: { id: number; nombre: string } | null;
}
