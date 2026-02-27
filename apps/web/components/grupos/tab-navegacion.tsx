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
    <div className="flex gap-0.5 items-end px-1">
      {tabs.map((tab) => {
        const esActiva = tabActiva === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onCambiarTab(tab.id)}
            className={`
              min-w-45 h-14 px-8 text-[clamp(0.95rem,1.2vw,1.35rem)] leading-none font-medium transition-all rounded-t-[18px]
              ${esActiva
                ? "bg-[#efefef] text-gray-700 shadow-sm relative z-10"
                : "bg-[#d1d1d4] text-gray-500 hover:bg-[#c6c7cb]"
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