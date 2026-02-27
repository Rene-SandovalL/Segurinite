"use client";

import { useState } from "react";
import { TabNavegacion, type TabActiva } from "../../../../../components/grupos/tab-navegacion";
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
    <div className="flex flex-col h-full">
      {/* ── Título del grupo ── */}
      <div className="px-10 pt-6 pb-3">
        <h1 className="text-[42px] font-bold text-white tracking-wide uppercase leading-tight">
          {grupo.nombre}
        </h1>
      </div>

      {/* ── Contenedor de pestañas + panel blanco ── */}
      <div className="flex-1 flex flex-col mx-5 mb-5 min-h-0">

        {/* Pestañas */}
        <TabNavegacion tabActiva={tabActiva} onCambiarTab={setTabActiva} />

        {/* Panel blanco de contenido */}
        <div
          className={`
            flex-1 bg-white overflow-y-auto p-8 shadow-sm
            ${tabActiva === "integrantes"
              ? "rounded-tr-2xl rounded-b-2xl"
              : "rounded-2xl"
            }
          `}
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
        </div>
      </div>
    </div>
  );
}