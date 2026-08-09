export type AlertaTipo =
  | "BPM_ALTO"
  | "BPM_BAJO"
  | "SPO2_BAJO"
  | "TEMP_ANOMALA"
  | "SIN_SENAL"
  | "VITAL_SIN_LECTURA"
  | "FUERA_DE_ZONA";

export type AlertaSeveridad = "ALERTA" | "PELIGRO";

export interface Alerta {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  grupoId: string | null;
  grupoNombre: string | null;
  tipo: AlertaTipo;
  severidad: AlertaSeveridad;
  createdAt: string;
  resuelta: boolean;
  resueltaAt: string | null;
  resueltaPor: { nombre: string; rol: "ADMIN" | "DOCENTE" } | null;
  notas: string | null;
}

export const ETIQUETA_ALERTA_TIPO: Record<AlertaTipo, string> = {
  BPM_ALTO: "Pulso elevado",
  BPM_BAJO: "Pulso bajo",
  SPO2_BAJO: "Oxigenación baja",
  TEMP_ANOMALA: "Temperatura anómala",
  SIN_SENAL: "Sin señal",
  VITAL_SIN_LECTURA: "Sin lectura de signos vitales",
  FUERA_DE_ZONA: "Fuera de zona",
};

export const COLOR_ALERTA_SEVERIDAD: Record<AlertaSeveridad, string> = {
  ALERTA: "#F5A623",
  PELIGRO: "#E56363",
};
