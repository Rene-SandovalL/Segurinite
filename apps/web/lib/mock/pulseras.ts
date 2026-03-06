// TODO: reemplazar con WebSocket o GET /api/pulseras/detectadas cuando el backend esté listo

export type EstadoPulsera = "conectado" | "disponible";

export interface PulseraMock {
  id: string;
  nombre: string;
  estado: EstadoPulsera;
}

/** Pulseras ya registradas en el sistema sin alumno asignado */
export const PULSERAS_CONECTADAS: PulseraMock[] = [
  { id: "SEG-WB-001", nombre: "SEG-WB", estado: "conectado" },
  { id: "SEG-WB-002", nombre: "SEG-WB", estado: "conectado" },
  { id: "SEG-WB-003", nombre: "SEG-WB", estado: "conectado" },
  { id: "SEG-WB-004", nombre: "SEG-WB", estado: "conectado" },
  { id: "SEG-WB-005", nombre: "SEG-WB", estado: "conectado" },
  { id: "SEG-WB-006", nombre: "SEG-WB", estado: "conectado" },
];

/** Pulseras detectadas por BLE pero nunca registradas */
export const PULSERAS_DISPONIBLES: PulseraMock[] = [
  { id: "SEG-WEB-001", nombre: "SEG-WEB", estado: "disponible" },
];
