"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type AlertaNivel = "peligro";

export interface Alerta {
  id: string;
  alumnoId: string;
  alumnoNombre: string;
  mensaje: string;
  createdAt: number;
  nivel: AlertaNivel;
  grupoId?: string;
  grupoNombre?: string;
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

  const pushAlerta = useCallback((alerta: Alerta) => {
    setAlertas((actuales) => {
      // Máximo 2 toasts visibles a la vez (no es un límite de por vida —
      // AlertaToast se auto-descarta solo, así que la ventana va rotando).
      if (actuales.length >= 2) {
        return actuales;
      }

      const alertaDuplicada = actuales.some(
        (actual) => actual.alumnoId === alerta.alumnoId,
      );

      if (alertaDuplicada) {
        return actuales;
      }

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
