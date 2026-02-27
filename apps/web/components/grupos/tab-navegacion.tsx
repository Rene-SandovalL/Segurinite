"use client";

/** Valores válidos para la pestaña activa */
export type TabActiva = "integrantes" | "mapa" | "docente";

interface TabNavegacionProps {
  tabActiva: TabActiva;
  onCambiarTab: (tab: TabActiva) => void;
}

const tabs: { id: TabActiva; label: string }[] = [
  { id: "integrantes", label: "Integrantes" },
  { id: "mapa",        label: "Mapa" },
  { id: "docente",     label: "Docente" },
];

/**
 * Pestañas de navegación del panel de detalle de grupo.
 *
 * La pestaña ACTIVA tiene:
 *   - Fondo blanco (bg-white)
 *   - Solo esquinas superiores redondeadas (rounded-t-xl)
 *   - Sin borde inferior → se "fusiona" con el panel blanco de abajo
 *
 * Las INACTIVAS tienen fondo gris y se ven "detrás" de la activa.
 * Este efecto imita las pestañas de carpeta del diseño original.
 */
export function TabNavegacion({ tabActiva, onCambiarTab }: TabNavegacionProps) {
  return (
    <div className="flex gap-2 items-end">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onCambiarTab(tab.id)}
          className={`
            px-14 py-4 rounded-t-2xl text-sm font-semibold transition-all
            ${tabActiva === tab.id
              ? "bg-white text-gray-800 shadow-sm relative z-10 -mb-px"
              : "bg-gray-300/80 text-gray-500 hover:bg-gray-200"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}