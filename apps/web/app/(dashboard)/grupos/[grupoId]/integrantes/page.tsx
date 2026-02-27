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

/**
 * Página: /grupos/[grupoId]/integrantes
 * Muestra las 3 pestañas y el grid de alumnos del grupo seleccionado.
 *
 * params.grupoId → viene de la URL, ej: /grupos/4a → grupoId = "4a"
 */
export default function IntegrantesPage({ params }: Props) {
  const [tabActiva, setTabActiva] = useState<TabActiva>("integrantes");

  // Busca el grupo en los datos de prueba usando el ID de la URL
  const grupo = gruposMock.find((g: Grupo) => g.id === params.grupoId) ?? gruposMock[0]!;

  function handleAgregarAlumno() {
    // TODO: abrir modal de registro de alumno + vinculación de pulsera BLE
    alert("Próximamente: Formulario para registrar alumno y vincular pulsera");
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Título del grupo ── */}
      <div className="px-10 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-white tracking-wide uppercase">
          {grupo.nombre}
        </h1>
      </div>

      {/* ── Pestañas ── */}
      <div className="px-8">
        <TabNavegacion tabActiva={tabActiva} onCambiarTab={setTabActiva} />
      </div>

      {/*
        Panel blanco de contenido.
        rounded-tl-none → la esquina superior izquierda queda recta
        para "conectarse" visualmente con la pestaña Integrantes activa.
      */}
      <div className="flex-1 bg-white mx-5 mb-5 rounded-2xl rounded-tl-none overflow-y-auto p-8 shadow-sm">

        {/* Pestaña: Integrantes */}
        {tabActiva === "integrantes" && (
          <IntegrantesGrid
            alumnos={alumnosMock.filter((a: Alumno) => a.grupoId === grupo.id)}
            onAgregarAlumno={handleAgregarAlumno}
          />
        )}

        {/* Pestaña: Mapa (placeholder hasta que se implemente) */}
        {tabActiva === "mapa" && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-lg">🗺️ Próximamente: Mapa interactivo del plantel</p>
          </div>
        )}

        {/* Pestaña: Docente (placeholder) */}
        {tabActiva === "docente" && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-lg">👩‍🏫 Próximamente: Información del docente asignado</p>
          </div>
        )}
      </div>
    </div>
  );
}