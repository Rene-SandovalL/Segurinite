"use client";

import { type Alumno } from "../../types/alumno";
import { AlumnoCard } from "./alumno-card";
import { AddAlumnoButton } from "./add-alumno-button";

interface IntegrantesGridProps {
  alumnos: Alumno[];
  onAgregarAlumno: () => void;
}

export function IntegrantesGrid({ alumnos, onAgregarAlumno }: IntegrantesGridProps) {
  return (
    <div className="flex flex-col gap-6 px-3">
      {/* Grid de alumnos — 3 columnas en desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-5 gap-y-5">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
      </div>

      {/* Botón para agregar nuevo alumno */}
      <AddAlumnoButton onClick={onAgregarAlumno} />
    </div>
  );
}