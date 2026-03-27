"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { MiembroCard } from "./miembro-card";

interface AlumnoCardDraggableProps {
  alumno: AlumnoMock;
  grupoId: string;
  colorFranja: string;
  forzarPeligro?: boolean;
}

export function AlumnoCardDraggable({
  alumno,
  grupoId,
  colorFranja,
  forzarPeligro = false,
}: AlumnoCardDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `alumno-${alumno.id}`,
    data: {
      alumnoId: alumno.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 30 : 1,
        opacity: isDragging ? 0 : 1,
      }}
      className="touch-none"
      {...listeners}
      {...attributes}
    >
      <div
        className="transition-all duration-200 ease-out"
        style={{
          transform: isDragging ? "scale(1.02)" : "scale(1)",
          boxShadow: isDragging
            ? "0 20px 36px rgba(0,0,0,0.26)"
            : "0 0 0 rgba(0,0,0,0)",
          borderRadius: 25,
        }}
      >
        <MiembroCard
          alumno={alumno}
          grupoId={grupoId}
          colorFranja={colorFranja}
          forzarPeligro={forzarPeligro}
        />
      </div>
    </div>
  );
}
