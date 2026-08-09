"use client";

import { useCallback, useState } from "react";
import { useAlertaSocket, type AlertaNuevaEvento } from "@/hooks/useAlertaSocket";
import { getAlumnoPorId } from "@/lib/api/segurinite";
import { ETIQUETA_ALERTA_TIPO } from "@/types/alerta";
import { AlertasContainer } from "./AlertasContainer";
import { useAlertas } from "./AlertasProvider";
import { SuperAlerta } from "./SuperAlerta";

interface AlertaCriticaPendiente {
  id: string;
  alumnoNombre: string;
  grupoNombre?: string;
  tipo: AlertaNuevaEvento["tipo"];
  severidad: AlertaNuevaEvento["severidad"];
}

/**
 * Monta el contenedor de toasts de alertas y se suscribe al WebSocket real de
 * alertas: eventos esCritica=true disparan la súper alerta a pantalla
 * completa, el resto va al toast de esquina existente.
 */
export function AlertasBootstrap() {
  const { pushAlerta } = useAlertas();
  const [colaCriticas, setColaCriticas] = useState<AlertaCriticaPendiente[]>([]);

  const handleAlerta = useCallback(
    async (evento: AlertaNuevaEvento) => {
      const alumno = await getAlumnoPorId(evento.alumnoId);
      const alumnoNombre = alumno?.nombreCompleto ?? "Alumno";

      if (evento.esCritica) {
        setColaCriticas((actuales) => [
          ...actuales,
          {
            id: `${evento.alumnoId}-${evento.tipo}-${Date.now()}`,
            alumnoNombre,
            grupoNombre: alumno?.grupoNombre,
            tipo: evento.tipo,
            severidad: evento.severidad,
          },
        ]);
        return;
      }

      pushAlerta({
        id: `${evento.alumnoId}-${evento.tipo}-${Date.now()}`,
        alumnoId: evento.alumnoId,
        alumnoNombre,
        mensaje: `${ETIQUETA_ALERTA_TIPO[evento.tipo]} — ${evento.severidad}`,
        createdAt: Date.now(),
        nivel: "peligro",
        grupoId: alumno?.grupoId,
        grupoNombre: alumno?.grupoNombre,
      });
    },
    [pushAlerta],
  );

  useAlertaSocket((evento) => {
    void handleAlerta(evento);
  });

  const alertaCriticaActual = colaCriticas[0];

  return (
    <>
      <AlertasContainer />

      {alertaCriticaActual && (
        <SuperAlerta
          alumnoNombre={alertaCriticaActual.alumnoNombre}
          grupoNombre={alertaCriticaActual.grupoNombre}
          tipo={alertaCriticaActual.tipo}
          severidad={alertaCriticaActual.severidad}
          onCerrar={() =>
            setColaCriticas((actuales) => actuales.slice(1))
          }
        />
      )}
    </>
  );
}
