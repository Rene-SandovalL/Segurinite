"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearAlumno, type CreateAlumnoPayload } from "@/lib/api/segurinite";
import { PulserasScanner } from "@/components/alumnos/pulseras-scanner";
import { FormularioRegistro } from "@/components/alumnos/formulario-registro";
import { ToastNotificacion, type ToastData } from "@/components/ui/toast";

interface NuevoRegistroAlumnoPanelProps {
  grupoId: string;
}

export function NuevoRegistroAlumnoPanel({ grupoId }: NuevoRegistroAlumnoPanelProps) {
  const router = useRouter();
  const [pulseraSeleccionadaId, setPulseraSeleccionadaId] = useState<string | null>(null);
  const [registrando, setRegistrando] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const registrarAlumno = async (
    payload: Omit<CreateAlumnoPayload, "pulseraId">,
  ) => {
    if (!pulseraSeleccionadaId) {
      return;
    }

    setRegistrando(true);

    try {
      await crearAlumno({
        ...payload,
        pulseraId: pulseraSeleccionadaId,
      });

      setToast({
        mensaje: "Alumno registrado correctamente",
        color: "#87D67B",
      });

      setTimeout(() => {
        router.push(`/groups/${grupoId}`);
        router.refresh();
      }, 700);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No se pudo registrar el alumno.";

      setToast({
        mensaje,
        color: "#E66363",
      });

      throw error;
    } finally {
      setRegistrando(false);
    }
  };

  if (!pulseraSeleccionadaId) {
    return (
      <PulserasScanner
        onVolver={() => router.back()}
        onSeleccionarPulsera={(pulseraId) => setPulseraSeleccionadaId(pulseraId)}
      />
    );
  }

  return (
    <>
      <FormularioRegistro
        onVolver={() => setPulseraSeleccionadaId(null)}
        onRegistrar={registrarAlumno}
        registrando={registrando}
      />

      {toast && <ToastNotificacion {...toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
