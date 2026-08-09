import type { AlertaSeveridad, AlertaTipo } from "./alerta";

export interface FiltrosEstadisticas {
  /** null = todos los grupos */
  grupoId: string | null;
  fechaInicio: string;
  fechaFin: string;
}

export interface AsistenciaPorGrupo {
  grupoId: number;
  grupoNombre: string;
  colorHex: string;
  totalAlumnos: number;
  totalPosible: number;
  presentes: number;
  tardanzas: number;
  ausentes: number;
  porcentajeAsistencia: number;
}

export interface EstadisticasAsistencia {
  rango: { fechaInicio: string; fechaFin: string; diasContados: number };
  grupos: AsistenciaPorGrupo[];
  totales: {
    presentes: number;
    tardanzas: number;
    ausentes: number;
    porcentajeAsistencia: number;
  };
}

export interface RankingFaltas {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  faltas: number;
  diasContados: number;
}

export interface ConteoPorTipo {
  tipo: AlertaTipo;
  total: number;
}

export interface ConteoPorGrupo {
  grupoId: number | null;
  grupoNombre: string;
  colorHex: string | null;
  total: number;
}

export interface RankingAlumnosAlertas {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  total: number;
}

export interface ConteoPorSeveridad {
  severidad: AlertaSeveridad;
  total: number;
}

export interface SerieDiaria {
  fecha: string;
  total: number;
}

export interface TiempoResolucion {
  minutosPromedio: number | null;
  alertasResueltas: number;
}

export interface TiempoEnEscuelaAlumno {
  alumnoId: string;
  nombre: string;
  grupoId: number | null;
  grupoNombre: string | null;
  primeraLectura: string;
  ultimaLectura: string;
  minutos: number;
}

export interface TiempoEnEscuela {
  fecha: string;
  alumnos: TiempoEnEscuelaAlumno[];
}

export interface VitalesPorGrupo {
  grupoId: number | null;
  grupoNombre: string;
  colorHex: string | null;
  alumnosConDatos: number;
  bpmPromedio: number | null;
  tempPromedio: number | null;
}
