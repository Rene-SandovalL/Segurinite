export type AsistenciaEstado = "PRESENTE" | "TARDANZA" | "AUSENTE";

export interface AsistenciaAlumno {
  alumnoId: string;
  nombre: string;
  estado: AsistenciaEstado;
  primeraDeteccion: string | null;
}
