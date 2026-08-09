import { DateTime } from 'luxon';
import { ConfiguracionHorarioCache } from '../configuracion/configuracion-cache.service';
import {
  ZONA_HORARIA_ESCUELA,
  calcularAsistenciaDelMensaje,
} from './asistencia-horario.util';

/** Construye el instante UTC correspondiente a una hora local de la escuela. */
function instanteLocal(iso: string): Date {
  return DateTime.fromISO(iso, { zone: ZONA_HORARIA_ESCUELA }).toJSDate();
}

const HORARIO_ESCOLAR: ConfiguracionHorarioCache = {
  horaEntrada: '07:00',
  horaSalida: '14:00',
  toleranciaTardanzaMinutos: 10,
};

describe('calcularAsistenciaDelMensaje', () => {
  it('clasifica PRESENTE justo en el límite de tolerancia (entrada + tolerancia, inclusive)', () => {
    const resultado = calcularAsistenciaDelMensaje(
      instanteLocal('2026-08-09T07:10:00'),
      HORARIO_ESCOLAR,
    );

    expect(resultado).toEqual({ fechaLocal: '2026-08-09', estado: 'PRESENTE' });
  });

  it('clasifica TARDANZA un segundo después del límite de tolerancia', () => {
    const resultado = calcularAsistenciaDelMensaje(
      instanteLocal('2026-08-09T07:10:01'),
      HORARIO_ESCOLAR,
    );

    expect(resultado).toEqual({ fechaLocal: '2026-08-09', estado: 'TARDANZA' });
  });

  it('no cuenta como asistencia un mensaje claramente fuera de la ventana escolar (después de hora_salida)', () => {
    const resultado = calcularAsistenciaDelMensaje(
      instanteLocal('2026-08-09T15:00:00'),
      HORARIO_ESCOLAR,
    );

    expect(resultado).toBeNull();
  });

  it('no cuenta como asistencia un mensaje antes de hora_entrada', () => {
    const resultado = calcularAsistenciaDelMensaje(
      instanteLocal('2026-08-09T06:59:59'),
      HORARIO_ESCOLAR,
    );

    expect(resultado).toBeNull();
  });

  it('respeta el límite inclusive de hora_salida', () => {
    const resultado = calcularAsistenciaDelMensaje(
      instanteLocal('2026-08-09T14:00:00'),
      HORARIO_ESCOLAR,
    );

    expect(resultado).toEqual({ fechaLocal: '2026-08-09', estado: 'TARDANZA' });
  });

  it('usa el día calendario LOCAL, no el UTC, para un mensaje que cruza la medianoche en UTC', () => {
    // Horario sintético de una escuela vespertina: con el horario real
    // (07:00–14:00) nunca se cruza la medianoche UTC en Mazatlán (UTC-7),
    // así que este caso usa un horario que sí lo cruza para reproducir
    // exactamente el bug original (getUTCHours mezclado con .setHours) si
    // algún día cambia el horario configurado o el servidor corre en otro
    // huso horario.
    const horarioVespertino: ConfiguracionHorarioCache = {
      horaEntrada: '23:00',
      horaSalida: '23:59',
      toleranciaTardanzaMinutos: 10,
    };

    // 2026-08-08T23:30:00 hora local de Mazatlán (UTC-7) == 2026-08-09T06:30:00Z
    const mensaje = instanteLocal('2026-08-08T23:30:00');
    expect(mensaje.toISOString()).toBe('2026-08-09T06:30:00.000Z');

    const resultado = calcularAsistenciaDelMensaje(mensaje, horarioVespertino);

    expect(resultado).toEqual({ fechaLocal: '2026-08-08', estado: 'TARDANZA' });
  });
});
