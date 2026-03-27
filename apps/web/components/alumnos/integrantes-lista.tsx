"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import {
  actualizarAlumno,
  quitarAlumnoDeGrupo,
  type CreateAlumnoPayload,
} from "@/lib/api/segurinite";
import { obtenerAlumnosEnRiesgoIds } from "@/lib/simulacion/alumnos-riesgo";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";
import {
  FormularioRegistro,
  type FormularioRegistroInitialValues,
} from "./formulario-registro";
import { AlumnoCardDraggable } from "./AlumnoCardDraggable";
import { DockAccionesAlumno } from "./DockAccionesAlumno";
import { ModalConfirmacionQuitar } from "./ModalConfirmacionQuitar";
import { MiembroCard } from "./miembro-card";

interface IntegrantesListaProps {
  alumnos: AlumnoMock[];
  grupoId: string;
  colorFranja: string;
}

/**
 * Panel de la pestaña "Integrantes".
 * Muestra un grid de 3 columnas de tarjetas de alumnos.
 */
export function IntegrantesLista({ alumnos, grupoId, colorFranja }: IntegrantesListaProps) {
  const router = useRouter();
  const alumnosEnRiesgoIds = obtenerAlumnosEnRiesgoIds(grupoId, alumnos);
  const alumnosPorId = useMemo(
    () => new Map(alumnos.map((alumno) => [alumno.id, alumno])),
    [alumnos],
  );

  const [draggingAlumnoId, setDraggingAlumnoId] = useState<string | null>(null);
  const [dropzoneActiva, setDropzoneActiva] = useState<string | null>(null);
  const [alumnoEdicion, setAlumnoEdicion] = useState<AlumnoMock | null>(null);
  const [alumnoPendienteQuitar, setAlumnoPendienteQuitar] = useState<AlumnoMock | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [quitandoAlumno, setQuitandoAlumno] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const alumnoDragging = draggingAlumnoId ? alumnosPorId.get(draggingAlumnoId) ?? null : null;

  const limpiarDrag = () => {
    setDraggingAlumnoId(null);
    setDropzoneActiva(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const alumnoId = String(event.active.id).replace("alumno-", "");
    setDraggingAlumnoId(alumnoId);
  };

  const onDragOver = (event: DragOverEvent) => {
    setDropzoneActiva(event.over ? String(event.over.id) : null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const alumnoId = String(event.active.id).replace("alumno-", "");
    const alumno = alumnosPorId.get(alumnoId) ?? null;
    const destino = event.over ? String(event.over.id) : null;

    if (!alumno || !destino) {
      limpiarDrag();
      return;
    }

    if (destino === "dropzone-actualizar") {
      setAlumnoEdicion(alumno);
    }

    if (destino === "dropzone-quitar") {
      setAlumnoPendienteQuitar(alumno);
    }

    limpiarDrag();
  };

  const onDragCancel = () => {
    limpiarDrag();
  };

  const normalizarParentesco = (valor?: string): "" | "madre" | "padre" | "hermano" | "otros" => {
    if (!valor) {
      return "";
    }

    const valorNormalizado = valor.trim().toLowerCase();

    if (
      valorNormalizado === "madre" ||
      valorNormalizado === "padre" ||
      valorNormalizado === "hermano" ||
      valorNormalizado === "otros"
    ) {
      return valorNormalizado;
    }

    return "otros";
  };

  const valoresInicialesEdicion = (alumno: AlumnoMock): FormularioRegistroInitialValues => {
    const tutor1 = alumno.tutores?.[0];
    const tutor2 = alumno.tutores?.[1];
    const emergencia = alumno.contactosEmergencia?.[0];

    return {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      fechaNacimiento: alumno.fechaNacimientoIso ?? "",
      tipoSangre: alumno.tipoSangre as FormularioRegistroInitialValues["tipoSangre"],
      tutor1Nombre: tutor1?.nombre ?? "",
      tutor1Telefono: tutor1?.telefono ?? "",
      tutor1Parentesco: normalizarParentesco(tutor1?.parentesco),
      tutor1Direccion: tutor1?.direccion ?? "",
      tutor2Nombre: tutor2?.nombre ?? "",
      tutor2Telefono: tutor2?.telefono ?? "",
      tutor2Parentesco: normalizarParentesco(tutor2?.parentesco),
      tutor2Direccion: tutor2?.direccion ?? "",
      emergenciaNombre: emergencia?.nombre ?? "",
      emergenciaTelefono: emergencia?.telefono ?? "",
      emergenciaParentesco: normalizarParentesco(emergencia?.parentesco),
      emergenciaDireccion: emergencia?.direccion ?? "",
      emergenciaFechaNacimiento: emergencia?.fechaNacimientoIso ?? "",
    };
  };

  const guardarCambios = async (payload: Omit<CreateAlumnoPayload, "pulseraId">) => {
    if (!alumnoEdicion) {
      return;
    }

    setGuardandoEdicion(true);

    try {
      await actualizarAlumno(alumnoEdicion.id, payload);
      setToast({
        mensaje: "Alumno actualizado correctamente",
        color: "#87D67B",
      });
      setAlumnoEdicion(null);
      router.refresh();
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const confirmarQuitar = async () => {
    if (!alumnoPendienteQuitar) {
      return;
    }

    setQuitandoAlumno(true);

    try {
      await quitarAlumnoDeGrupo(alumnoPendienteQuitar.id);
      setToast({
        mensaje: "Alumno desasignado del grupo",
        color: "#87D67B",
      });
      setAlumnoPendienteQuitar(null);
      router.refresh();
    } finally {
      setQuitandoAlumno(false);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col" style={{ gap: 18, margin: 32 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
            >
              {alumnos.map((alumno) => (
                <AlumnoCardDraggable
                  key={alumno.id}
                  alumno={alumno}
                  grupoId={grupoId}
                  colorFranja={colorFranja}
                  forzarPeligro={alumnosEnRiesgoIds.has(alumno.id)}
                />
              ))}
            </div>

            <Link
              href={`/groups/${grupoId}/pulsera`}
              className="w-full flex items-center justify-center rounded-[25px] bg-[#D9D9D9] text-[#3A3A3A] font-normal focus:outline-none"
              style={{
                height: 64,
                fontSize: "clamp(24px, 2.5vw, 36px)",
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                textDecoration: "none",
              }}
              aria-label="Agregar integrante"
            >
              +
            </Link>
          </div>
        </div>

        <DragOverlay>
          {alumnoDragging ? (
            <div className="w-[min(340px,80vw)]" style={{ transform: "scale(1.03)" }}>
              <MiembroCard
                alumno={alumnoDragging}
                grupoId={grupoId}
                colorFranja={colorFranja}
                forzarPeligro={alumnosEnRiesgoIds.has(alumnoDragging.id)}
              />
            </div>
          ) : null}
        </DragOverlay>

        <DockAccionesAlumno
          visible={Boolean(alumnoDragging)}
          overId={dropzoneActiva}
          colorActualizar={colorFranja}
        />
      </DndContext>

      {alumnoPendienteQuitar && (
        <ModalConfirmacionQuitar
          nombreAlumno={alumnoPendienteQuitar.nombreCompleto ?? `${alumnoPendienteQuitar.nombre} ${alumnoPendienteQuitar.apellido}`}
          onCancelar={() => setAlumnoPendienteQuitar(null)}
          onConfirmar={() => void confirmarQuitar()}
          procesando={quitandoAlumno}
        />
      )}

      {alumnoEdicion && (
        <div
          className="fixed inset-0 z-50"
          style={{
            background: "rgba(0, 0, 0, 0.48)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            className="absolute inset-x-[3vw] top-[4vh] bottom-[4vh] rounded-[25px] bg-white overflow-hidden"
            style={{ boxShadow: "0 18px 42px rgba(0,0,0,0.3)" }}
          >
            <FormularioRegistro
              onVolver={() => setAlumnoEdicion(null)}
              onRegistrar={guardarCambios}
              registrando={guardandoEdicion}
              modo="edicion"
              initialValues={valoresInicialesEdicion(alumnoEdicion)}
            />
          </div>
        </div>
      )}

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
