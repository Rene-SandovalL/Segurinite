"use client";

import { AlertaToast } from "./AlertaToast";
import { useAlertas } from "./AlertasProvider";

export function AlertasContainer() {
  const { alertas, dismissAlerta } = useAlertas();

  return (
    <div className="fixed right-4 top-4 z-[70] pointer-events-none">
      <div className="flex flex-col gap-3 items-end">
        {alertas.map((alerta) => (
          <AlertaToast key={alerta.id} alerta={alerta} onDismiss={dismissAlerta} />
        ))}
      </div>
    </div>
  );
}
