"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type AlertaNivel = "peligro";

export interface Alerta {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  mensaje: string;
  createdAt: number;
  nivel: AlertaNivel;
  grupoId?: string;
}

interface AlertasContextValue {
  alertas: Alerta[];
  pushAlerta: (alerta: Alerta) => void;
  dismissAlerta: (id: string) => void;
  clearAll: () => void;
}

const AlertasContext = createContext<AlertasContextValue | null>(null);

interface AlertasProviderProps {
  children: React.ReactNode;
}

export function AlertasProvider({ children }: AlertasProviderProps) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const totalMostradasRef = useRef(0);

  const pushAlerta = useCallback((alerta: Alerta) => {
    setAlertas((actuales) => {
      if (totalMostradasRef.current >= 2) {
        return actuales;
      }

      if (actuales.length >= 2) {
        return actuales;
      }

      const alertaDuplicada = actuales.some(
        (actual) => actual.alumnoId === alerta.alumnoId,
      );

      if (alertaDuplicada) {
        return actuales;
      }

      totalMostradasRef.current += 1;
      return [...actuales, alerta];
    });
  }, []);

  const dismissAlerta = useCallback((id: string) => {
    setAlertas((actuales) => actuales.filter((alerta) => alerta.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlertas([]);
  }, []);

  const value = useMemo(
    () => ({
      alertas,
      pushAlerta,
      dismissAlerta,
      clearAll,
    }),
    [alertas, pushAlerta, dismissAlerta, clearAll],
  );

  return <AlertasContext.Provider value={value}>{children}</AlertasContext.Provider>;
}

export function useAlertas() {
  const context = useContext(AlertasContext);

  if (!context) {
    throw new Error("useAlertas debe usarse dentro de AlertasProvider");
  }

  return context;
}
