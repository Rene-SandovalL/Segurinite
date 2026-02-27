"use client";

import { useMemo } from "react";
import { alumnosMock } from "../lib/mock-data";

export function useAlumnos(grupoId: string) {
  const alumnos = useMemo(() => alumnosMock.filter((a) => a.grupoId === grupoId), [grupoId]);
  return { alumnos };
}
