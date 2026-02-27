"use client";

import { type Alumno } from "../../types/alumno";
import { AlumnoCard } from "./alumno-card";

interface IntegrantesGridProps {
  alumnos: Alumno[];
  onAgregarAlumno: () => void;
}

/**
 * Cuadrícula de tarjetas de alumnos.
 *
 * Layout responsivo:
 *   - Móvil (< sm):   1 columna
 *   - Tablet (sm):    2 columnas
 *   - Desktop (lg):   3 columnas  ← como en la imagen
 *
 * El botón "+" siempre aparece al final, ocupando el ancho completo.
 */
export function IntegrantesGrid({ alumnos, onAgregarAlumno }: IntegrantesGridProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Grid de alumnos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alumnos.map((alumno) => (
          <AlumnoCard key={alumno.id} alumno={alumno} />
        ))}
      </div>

      {/* Botón para agregar nuevo alumno */}
      <button
        onClick={onAgregarAlumno}
        className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-400 text-2xl font-light transition-all"
        aria-label="Agregar nuevo alumno"
      >
        +
      </button>
    </div>
  );
}