"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { AlertaSeveridad, AlertaTipo } from "@/types/alerta";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AlertaNuevaEvento {
  alumnoId: string;
  tipo: AlertaTipo;
  severidad: AlertaSeveridad;
  /** true SOLO para TEMP_ANOMALA y SIN_SENAL. */
  esCritica: boolean;
}

/**
 * Se conecta al WebSocket de alertas y llama a onAlerta por cada evento
 * 'alerta:nueva' recibido. Igual que useTelemetriaSocket, no filtra nada
 * server-side — quien use este hook decide qué hacer con cada evento.
 */
export function useAlertaSocket(
  onAlerta: (evento: AlertaNuevaEvento) => void,
) {
  const onAlertaRef = useRef(onAlerta);
  onAlertaRef.current = onAlerta;

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("alerta:nueva", (evento: AlertaNuevaEvento) => {
      onAlertaRef.current(evento);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
