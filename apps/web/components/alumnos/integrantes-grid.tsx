"use client";

import { type Alumno } from "../../types/alumno";
import type { ColorGrupo } from "../../types/grupo";
import { AlumnoCard } from "./alumno-card";
import { AddAlumnoButton } from "./add-alumno-button";

interface IntegrantesGridProps {
  alumnos: Alumno[];
  grupoId: string;
  colorGrupo?: ColorGrupo;
}

export function IntegrantesGrid({ alumnos, grupoId, colorGrupo = "morado" }: IntegrantesGridProps) {
  return (
    <div className="flex flex-col gap-6 px-3">
      {/* Grid de alumnos — 3 columnas en desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-5 gap-y-5">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} colorGrupo={colorGrupo} />
        ))}
      </div>

      {/* Botón para agregar nuevo alumno */}
      <AddAlumnoButton href={`/grupos/${grupoId}/anadir-pulsera`} />
    </div>
  );
}