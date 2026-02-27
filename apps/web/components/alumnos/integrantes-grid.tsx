"use client";

import { type Alumno } from "../../types/alumno";
import { AlumnoCard } from "./alumno-card";

interface IntegrantesGridProps {
  alumnos: Alumno[];
  onAgregarAlumno: () => void;
}

export function IntegrantesGrid({ alumnos, onAgregarAlumno }: IntegrantesGridProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Grid de alumnos — 3 columnas en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
      </div>

      {/* Botón para agregar nuevo alumno */}
      <button
        onClick={onAgregarAlumno}
        className="w-full py-4 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-400 text-2xl font-light transition-all"
        aria-label="Agregar nuevo alumno"
      >
        +
      </button>
    </div>
  );
}