"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { useAlertas } from "@/components/alertas/AlertasProvider";

const MENSAJES_ALERTA = [
  "Pulso elevado detectado.",
  "Temperatura anormal.",
  "Posible salida de zona segura.",
  "Movimiento inusual detectado.",
  "Señal de pulsera inestable.",
] as const;

function randomEnRango(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delaySegundos(min: number, max: number): number {
  return randomEnRango(min, max) * 1000;
}

export function useSimuladorAlertas(alumnos: AlumnoMock[]) {
  const { pushAlerta } = useAlertas();

  const alumnosEnRiesgo = useMemo(
    () => alumnos.filter((alumno) => alumno.estado === "peligro" || alumno.estado === "alerta"),
    [alumnos],
  );

  const alumnosRef = useRef<AlumnoMock[]>(alumnos);
  const alumnosEnRiesgoRef = useRef<AlumnoMock[]>(alumnosEnRiesgo);
  const alumnosAlertadosRef = useRef<Set<string>>(new Set());
  const totalGeneradasRef = useRef<number>(0);

  useEffect(() => {
    alumnosRef.current = alumnos;
  }, [alumnos]);

  useEffect(() => {
    alumnosEnRiesgoRef.current = alumnosEnRiesgo;
  }, [alumnosEnRiesgo]);

  useEffect(() => {
    let activo = true;
    let timeoutId: number | null = null;

    const programar = (esperaMs: number) => {
      timeoutId = window.setTimeout(() => {
        if (!activo) {
          return;
        }

        const alumnosRiesgo = alumnosEnRiesgoRef.current;
        const todos = alumnosRef.current;
        const poolBase = alumnosRiesgo.length > 1 ? alumnosRiesgo : todos;

        if (totalGeneradasRef.current >= 2) {
          return;
        }

        if (poolBase.length === 0) {
          programar(delaySegundos(15, 45));
          return;
        }

        const noAlertados = poolBase.filter(
          (alumno) => !alumnosAlertadosRef.current.has(alumno.id),
        );

        const candidatos = noAlertados.length > 0 ? noAlertados : poolBase;
        const alumno = candidatos[randomEnRango(0, candidatos.length - 1)];
        const mensaje =
          MENSAJES_ALERTA[randomEnRango(0, MENSAJES_ALERTA.length - 1)] ??
          "Movimiento inusual detectado.";

        if (!alumno) {
          programar(delaySegundos(15, 45));
          return;
        }

        pushAlerta({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          alumnoId: alumno.id,
          alumnoNombre: alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`,
          mensaje,
          createdAt: Date.now(),
          nivel: "peligro",
          grupoId: alumno.grupoId,
        });

        alumnosAlertadosRef.current.add(alumno.id);
        totalGeneradasRef.current += 1;

        if (totalGeneradasRef.current >= 2) {
          return;
        }

        programar(delaySegundos(15, 45));
      }, esperaMs);
    };

    programar(delaySegundos(10, 25));

    return () => {
      activo = false;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pushAlerta]);
}
