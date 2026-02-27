import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { TabNavigation } from "../../../../../components/grupos/tab-navigation";
import { DocenteProfilePanel } from "../../../../../components/grupos/docente-profile-panel";
import { docentesPorGrupoMock, gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";

interface Props {
  params: { grupoId: string };
}

export default function DocentePage({ params }: Props) {
  const grupo = gruposMock.find((g: Grupo) => g.id === params.grupoId) ?? gruposMock[0]!;
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
