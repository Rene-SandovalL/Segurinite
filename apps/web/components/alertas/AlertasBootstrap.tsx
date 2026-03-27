"use client";

import { useEffect, useState } from "react";
import { getAlumnos } from "@/lib/api/segurinite";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { useSimuladorAlertas } from "@/hooks/useSimuladorAlertas";
import { AlertasContainer } from "./AlertasContainer";

export function AlertasBootstrap() {
  const [alumnos, setAlumnos] = useState<AlumnoMock[]>([]);

  useSimuladorAlertas(alumnos);

  useEffect(() => {
    let activo = true;

    const cargarAlumnos = async () => {
      try {
        const respuesta = await getAlumnos();

        if (!activo) {
          return;
        }

        setAlumnos(respuesta);
      } catch {
        // En simulación ignoramos errores puntuales y reintentamos con el siguiente intervalo.
      }
    };

    void cargarAlumnos();

    const intervalId = window.setInterval(() => {
      void cargarAlumnos();
    }, 45000);

    return () => {
      activo = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return <AlertasContainer />;
}
