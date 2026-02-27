import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { TabNavigation } from "../../../../../components/grupos/tab-navigation";
import { DocenteProfilePanel } from "../../../../../components/grupos/docente-profile-panel";
import { docentesPorGrupoMock, gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";

interface Props {
  params: Promise<{ grupoId: string }>;
}

export default async function DocentePage({ params }: Props) {
  const { grupoId } = await params;
  const grupo = gruposMock.find((g: Grupo) => g.id === grupoId) ?? gruposMock[0]!;
  const docente = docentesPorGrupoMock[grupo.id] ?? docentesPorGrupoMock["4a"]!;

  return (
    <DashboardContentShell
      titulo={grupo.nombre}
      tabs={<TabNavigation grupoId={grupo.id} tabActiva="docente" />}
      unirConTabs={false}
    >
      <DocenteProfilePanel docente={docente} />
    </DashboardContentShell>
  );
}
