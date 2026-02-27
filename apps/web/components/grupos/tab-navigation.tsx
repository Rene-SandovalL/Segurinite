import Link from "next/link";

export type TabActiva = "integrantes" | "mapa" | "docente";

interface TabNavigationProps {
  grupoId: string;
  tabActiva: TabActiva;
}

const tabs: { id: TabActiva; label: string }[] = [
  { id: "integrantes", label: "Integrantes" },
  { id: "mapa", label: "Mapa" },
  { id: "docente", label: "Docente" },
];

export function TabNavigation({ grupoId, tabActiva }: TabNavigationProps) {
  return (
    <div className="flex gap-0.5 items-end px-1">
      {tabs.map((tab) => {
        const esActiva = tabActiva === tab.id;
        return (
          <Link
            key={tab.id}
            href={`/grupos/${grupoId}/${tab.id}`}
            className={`
              min-w-45 h-14 px-8 text-[clamp(0.95rem,1.2vw,1.35rem)] leading-none font-medium transition-all rounded-t-[18px]
              inline-flex items-center justify-center
              ${esActiva
                ? "bg-[#efefef] text-gray-700 shadow-sm relative z-10"
                : "bg-[#d1d1d4] text-gray-500 hover:bg-[#c6c7cb]"
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
