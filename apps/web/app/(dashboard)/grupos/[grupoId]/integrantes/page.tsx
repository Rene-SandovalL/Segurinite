"use client";

import { use } from "react";
import { TabNavigation } from "../../../../../components/grupos/tab-navigation";
import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { IntegrantesGrid } from "../../../../../components/alumnos/integrantes-grid";
import { alumnosMock, gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";
import type { Alumno } from "../../../../../types/alumno";

interface Props {
  params: Promise<{ grupoId: string }>;
}

export default function IntegrantesPage({ params }: Props) {
  const { grupoId } = use(params);
  const grupo = gruposMock.find((g: Grupo) => g.id === grupoId) ?? gruposMock[0]!;

  return (
    <DashboardContentShell
      titulo={grupo.nombre}
      tabs={<TabNavigation grupoId={grupo.id} tabActiva="integrantes" />}
      unirConTabs
    >
      <IntegrantesGrid
        alumnos={alumnosMock.filter((a: Alumno) => a.grupoId === grupoId)}
        grupoId={grupoId}
        colorGrupo={grupo.color}
      />
    </DashboardContentShell>
  );
}