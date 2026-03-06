export type Tab = "integrantes" | "mapa" | "docente";

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "integrantes", label: "Integrantes" },
  { key: "mapa",        label: "Mapa"         },
  { key: "docente",     label: "Docente"       },
];

/**
 * Barra de pestañas.
 * - Pestaña activa: fondo blanco, mayor altura, sin margen superior
 * - Pestañas inactivas: fondo gris #D9D9D9, posicionadas más abajo (mt-auto)
 */
export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex items-end gap-0" style={{ height: 86 }}>
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex items-center justify-center focus:outline-none cursor-pointer"
            style={{
              width: "clamp(140px, 14vw, 256px)",
              height: isActive ? 86 : 65,
              borderRadius: "25px 25px 0 0",
              background: isActive ? "#FFFFFF" : "#D9D9D9",
              marginTop: isActive ? 0 : "auto",
            }}
          >
            <span
              className="font-normal text-[clamp(14px,1.5vw,24px)]"
              style={{ color: isActive ? "#3A3A3A" : "#8A8A8A" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
