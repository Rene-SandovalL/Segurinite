"use client";

import { useMemo } from "react";
import { gruposMock } from "../lib/mock-data";

export function useGrupos() {
  const grupos = useMemo(() => gruposMock, []);
  return { grupos };
}
