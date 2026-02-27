"use client";

import { type Alumno } from "../../types/alumno";
import { AlumnoCard } from "./alumno-card";

interface IntegrantesGridProps {
  alumnos: Alumno[];
  onAgregarAlumno: () => void;
}

export function IntegrantesGrid({ alumnos, onAgregarAlumno }: IntegrantesGridProps) {
  return (
    <div className="flex flex-col gap-11 px-3">
      {/* Grid de alumnos — 3 columnas en desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-12 gap-y-8">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
      </div>

      {/* Botón para agregar nuevo alumno */}
      <button
        onClick={onAgregarAlumno}
        className="w-full h-14 rounded-2xl bg-[#d0d1d6] hover:bg-[#c4c6cb] text-gray-600 text-4xl leading-none font-light transition-all"
        aria-label="Agregar nuevo alumno"
      >
        +
      </button>
    </div>
  );
}