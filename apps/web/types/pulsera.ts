export type EstadoPulsera = "DISPONIBLE" | "CONECTADA" | "REGISTRADA" | "ASIGNADA";

export interface Pulsera {
  id: string;
  uuid: string;
  alias: string | null;
  estado: EstadoPulsera;
  macAddress: string | null;
  bateria: number | null;
  lastSeenAt: string | null;
}
