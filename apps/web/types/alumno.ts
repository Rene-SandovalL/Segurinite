/** Estado de salud/seguridad del alumno — semáforo */
export type EstadoAlumno = "normal" | "alerta" | "peligro";

/** Representa un Alumno dentro de un grupo */
export interface Alumno {
  id: string;
  nombre: string;       // Ej: "ALEJANDRO"
  apellido: string;     // Ej: "GONZALEZ"
  iniciales: string;    // Ej: "AG" — se muestra en el avatar
  grupoId: string;      // ID del grupo al que pertenece
  estado: EstadoAlumno; // Para el semáforo de color
}