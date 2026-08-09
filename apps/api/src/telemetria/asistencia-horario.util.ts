import { DateTime } from 'luxon';
import { asistencia_estado } from '../generated/prisma/client';
import { ConfiguracionHorarioCache } from '../configuracion/configuracion-cache.service';

/**
 * Única fuente de verdad para el huso horario de la escuela. Hardcodeado por
 * ahora — si en el futuro se necesita para otra institución en otro huso, se
 * agrega como campo de configuracion_horario en ese momento.
 */
export const ZONA_HORARIA_ESCUELA = 'America/Mazatlan';

export interface AsistenciaDelMensaje {
  /** Día calendario LOCAL de la escuela (no UTC) al que pertenece el mensaje. */
  fechaLocal: string;
  estado: 'PRESENTE' | 'TARDANZA';
}

/**
 * Decide si un mensaje de telemetría cuenta como asistencia y, si sí, si es
 * PRESENTE o TARDANZA. Toda la comparación ocurre en ZONA_HORARIA_ESCUELA —
 * nunca se mezcla extracción UTC (getUTCHours) con métodos que dependen del
 * huso del proceso (.setHours), que fue la causa raíz del bug original.
 *
 * Devuelve null si el mensaje llegó fuera de la ventana
 * [hora_entrada, hora_salida] (ambos inclusive): esos mensajes no deben
 * crear ni actualizar ninguna fila de asistencia.
 */
export function calcularAsistenciaDelMensaje(
  instanteUtc: Date,
  horario: ConfiguracionHorarioCache,
): AsistenciaDelMensaje | null {
  const local = DateTime.fromJSDate(instanteUtc, { zone: 'utc' }).setZone(
    ZONA_HORARIA_ESCUELA,
  );

  const entrada = conHoraLocal(local, horario.horaEntrada);
  const salida = conHoraLocal(local, horario.horaSalida);

  if (local < entrada || local > salida) {
    return null;
  }

  const limiteTardanza = entrada.plus({
    minutes: horario.toleranciaTardanzaMinutos,
  });

  return {
    fechaLocal: local.toISODate()!,
    estado:
      local <= limiteTardanza
        ? asistencia_estado.PRESENTE
        : asistencia_estado.TARDANZA,
  };
}

/** Mismo día calendario que `referencia`, con la hora "HH:mm" indicada. */
function conHoraLocal(referencia: DateTime, horaHHmm: string): DateTime {
  const [hour, minute] = horaHHmm.split(':').map(Number);
  return referencia.set({ hour, minute, second: 0, millisecond: 0 });
}
