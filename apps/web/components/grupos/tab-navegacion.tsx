"use client";

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
 * Pestañas estilo carpeta.
 *
 * "Integrantes" activa → fondo blanco conectado al panel, sin borde inferior.
 * "Mapa" y "Docente" inactivas → fondo gris con esquinas superiores redondeadas.
 * Cuando otra pestaña está activa, esa toma el fondo blanco.
 */
export function TabNavegacion({ tabActiva, onCambiarTab }: TabNavegacionProps) {
  return (
    <div className="flex items-end">
      {tabs.map((tab) => {
        const esActiva = tabActiva === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onCambiarTab(tab.id)}
            className={`
              px-8 py-3 text-sm font-semibold transition-all relative
              ${esActiva
                ? "bg-white text-gray-800 rounded-t-2xl z-10"
                : "bg-gray-400/60 text-gray-600 hover:bg-gray-300/80 rounded-t-2xl ml-1"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}