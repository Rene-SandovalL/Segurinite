"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface TelemetriaUpdateEvento {
  alumnoId: string;
  beaconId: number | null;
  bpm: number;
  spo2: number;
  temp: number;
}

/**
 * Se conecta al WebSocket de telemetría y llama a onUpdate por cada evento
 * 'telemetria:update' recibido. El backend todavía no filtra por grupo —
 * emite a todos los clientes conectados — así que quien use este hook filtra
 * client-side lo que le interese (por alumnoId, por lista de alumnos, etc).
 */
export function useTelemetriaSocket(
  onUpdate: (evento: TelemetriaUpdateEvento) => void,
) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("telemetria:update", (evento: TelemetriaUpdateEvento) => {
      onUpdateRef.current(evento);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
