/** Estado de salud/seguridad del alumno — semáforo */
export type EstadoAlumno = "normal" | "alerta" | "peligro";
export type GrupoColorAlumno = string;

export interface ContactoEmergencia {
  nombre: string;
  edad: number;
  fechaNacimiento: string;
  fechaNacimientoIso?: string;
  telefono: string;
  parentesco?: string;
  direccion?: string;
}

export interface TutorAlumno {
  nombre: string;
  telefono: string;
  parentesco?: string;
  direccion?: string;
}

export interface DatosVitales {
  presionSys: number;
  presionDia: number;
  pulso: number;
  temperatura: number;
  ultimaLectura: string;
}

/** Representa un Alumno dentro de un grupo */
export interface Alumno {
  id: string;
  nombre: string;       // Ej: "ALEJANDRO"
  apellido: string;     // Ej: "GONZALEZ"
  iniciales: string;    // Ej: "AG" — se muestra en el avatar
  grupoId: string;      // ID del grupo al que pertenece
  grupoColor?: GrupoColorAlumno;
  estado: EstadoAlumno; // Para el semáforo de color
  nombreCompleto?: string;
  edad?: number;
  fechaNacimiento?: string;
  fechaNacimientoIso?: string;
  tipoSangre?: string;
  direccion?: string;
  nombrePadre?: string;
  telefonoPadre?: string;
  tutores?: TutorAlumno[];
  fotoUrl?: string;
  idDispositivo?: string;
  ultimaConexion?: string;
  contactosEmergencia?: ContactoEmergencia[];
  datosVitales?: DatosVitales;
}