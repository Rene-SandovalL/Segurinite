"use client";

import { useCallback, useEffect, useState } from "react";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { BotonAtras } from "@/components/ui/boton-atras";
import { useAlertaSocket } from "@/hooks/useAlertaSocket";
import { getAlertas, resolverAlerta } from "@/lib/api/segurinite";
import type { Alerta } from "@/types/alerta";
import { AlertaCard } from "./AlertaCard";

interface SeccionProps {
  titulo: string;
  vacio: string;
  alertas: Alerta[];
  onResolver?: (id: string) => Promise<void>;
}

function Seccion({ titulo, vacio, alertas, onResolver }: SeccionProps) {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <span className="text-[#3A3A3A] font-normal" style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>
        {titulo}
      </span>

      {alertas.length === 0 ? (
        <p className="text-[#8A8A8A]" style={{ fontSize: 15 }}>
          {vacio}
        </p>
      ) : (
        <div className="flex flex-col" style={{ gap: 10 }}>
          {alertas.map((alerta) => (
            <AlertaCard key={alerta.id} alerta={alerta} onResolver={onResolver} />
          ))}
        </div>
      )}
    </div>
  );
}

interface AlertasPanelProps {
  onSalir: () => void;
}

/**
 * Reemplaza el contenido principal con el historial de alertas: dos
 * contenedores (sin resolver / resueltas), actualizados solos vía WebSocket
 * cuando llega 'alerta:nueva' — mismo patrón que DispositivosPanel.
 */
export function AlertasPanel({ onSalir }: AlertasPanelProps) {
  const [sinResolver, setSinResolver] = useState<Alerta[]>([]);
  const [resueltas, setResueltas] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const [pendientes, cerradas] = await Promise.all([
        getAlertas(false),
        getAlertas(true),
      ]);
      setSinResolver(pendientes);
      setResueltas(cerradas);
      setError(null);
    } catch {
      setError("No se pudo cargar el historial de alertas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useAlertaSocket(() => {
    void cargar();
  });

  const handleResolver = useCallback(
    async (id: string) => {
      await resolverAlerta(id);
      await cargar();
    },
    [cargar],
  );

  return (
    <>
      <GrupoHeader titulo="ALERTAS" />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white overflow-hidden flex flex-col" style={{ borderRadius: 25 }}>
          <div className="shrink-0" style={{ padding: "28px 0 0 28px" }}>
            <BotonAtras onClick={onSalir} />
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col"
            style={{ padding: "16px clamp(20px, 3vw, 48px) 40px", gap: 28 }}
          >
            {cargando && (
              <p className="text-[#8A8A8A]" style={{ fontSize: 16 }}>
                Cargando historial...
              </p>
            )}

            {error && (
              <p className="text-[#E56363]" style={{ fontSize: 16 }}>
                {error}
              </p>
            )}

            {!cargando && !error && (
              <>
                <Seccion
                  titulo="Sin resolver"
                  vacio="No hay alertas sin resolver."
                  alertas={sinResolver}
                  onResolver={handleResolver}
                />
                <Seccion
                  titulo="Resueltas"
                  vacio="Todavía no se resolvió ninguna alerta."
                  alertas={resueltas}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
