"use client";

import { useState } from "react";
import { TabNavegacion, type TabActiva } from "../../../../../components/grupos/tab-navegacion";
import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { IntegrantesGrid } from "../../../../../components/alumnos/integrantes-grid";
import { alumnosMock, gruposMock } from "../../../../../lib/mock-data";
import type { Grupo } from "../../../../../types/grupo";
import type { Alumno } from "../../../../../types/alumno";

interface Props {
  params: { grupoId: string };
}

export default function IntegrantesPage({ params }: Props) {
  const [tabActiva, setTabActiva] = useState<TabActiva>("integrantes");
  const grupo = gruposMock.find((g: Grupo) => g.id === params.grupoId) ?? gruposMock[0]!;

  function handleAgregarAlumno() {
    alert("Próximamente: Formulario para registrar alumno y vincular pulsera");
  }

  return (
    <DashboardContentShell
      titulo={grupo.nombre}
      tabs={<TabNavegacion tabActiva={tabActiva} onCambiarTab={setTabActiva} />}
      unirConTabs={tabActiva === "integrantes"}
    >
      {tabActiva === "integrantes" && (
        <IntegrantesGrid
          alumnos={alumnosMock.filter((a: Alumno) => a.grupoId === grupo.id)}
          onAgregarAlumno={handleAgregarAlumno}
        />
      )}

      {tabActiva === "mapa" && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-lg">🗺️ Próximamente: Mapa interactivo del plantel</p>
        </div>
      )}

      {tabActiva === "docente" && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-lg">👩‍🏫 Próximamente: Información del docente asignado</p>
        </div>
      )}
    </DashboardContentShell>
  );
}