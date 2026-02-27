import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { TabNavigation } from "../../../../../components/grupos/tab-navigation";
import { gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";

interface Props {
  params: Promise<{ grupoId: string }>;
}

export default async function MapaPage({ params }: Props) {
  const { grupoId } = await params;
  const grupo = gruposMock.find((g: Grupo) => g.id === grupoId) ?? gruposMock[0]!;

  return (
    <DashboardContentShell
      titulo={grupo.nombre}
      tabs={<TabNavigation grupoId={grupo.id} tabActiva="mapa" />}
      unirConTabs={false}
    >
      <div className="h-full flex items-center justify-center text-gray-500">
        <p className="text-2xl">Mapa en stand by</p>
      </div>
    </DashboardContentShell>
  );
}
