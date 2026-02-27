"use client";

import { TabNavigation } from "../../../../../components/grupos/tab-navigation";
import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { IntegrantesGrid } from "../../../../../components/alumnos/integrantes-grid";
import { alumnosMock, gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";
import type { Alumno } from "../../../../../types/alumno";

interface Props {
  params: { grupoId: string };
}

export default function IntegrantesPage({ params }: Props) {
  const grupo = gruposMock.find((g: Grupo) => g.id === params.grupoId) ?? gruposMock[0]!;

  function handleAgregarAlumno() {
    alert("Próximamente: Formulario para registrar alumno y vincular pulsera");
  }

  return (
    <DashboardContentShell
      titulo={grupo.nombre}
      tabs={<TabNavigation grupoId={grupo.id} tabActiva="integrantes" />}
      unirConTabs
    >
      <IntegrantesGrid
        alumnos={alumnosMock.filter((a: Alumno) => a.grupoId === grupo.id)}
        onAgregarAlumno={handleAgregarAlumno}
      />
    </DashboardContentShell>
  );
}