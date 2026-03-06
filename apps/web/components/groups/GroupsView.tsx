"use client";

import { useState } from "react";
import GroupSidebar from "./GroupSidebar";
import TabBar, { type Tab } from "./TabBar";
import MembersTab from "./MembersTab";
import DocenteTab from "./DocenteTab";
import StudentView from "./StudentView";
import AddBandPanel from "./AddBandPanel";
import { GRUPOS_MOCK, COLOR_HEX } from "@/lib/mock/grupos";
import { getAlumnosByGrupo } from "@/lib/mock/alumnos";
import { getDocenteByGrupo } from "@/lib/mock/docentes";

import type { GrupoMock } from "@/lib/mock/grupos";

const DEFAULT_ID = GRUPOS_MOCK[0]!.id;

/**
 * Vista completa de Grupos — componente cliente con estado local.
 * Layout: sidebar izquierdo fijo + panel derecho con encabezado y tabs.
 */
export default function GroupsView() {
  const [selectedGrupoId, setSelectedGrupoId] = useState(DEFAULT_ID);
  const [activeTab, setActiveTab] = useState<Tab>("integrantes");
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  const [showAddBand, setShowAddBand] = useState(false);

  const grupo: GrupoMock =
    GRUPOS_MOCK.find((g) => g.id === selectedGrupoId) ?? GRUPOS_MOCK[0]!;
  const alumnos = getAlumnosByGrupo(grupo.id);
  const docente = getDocenteByGrupo(grupo.id);
  const headerColor = COLOR_HEX[grupo.color];

  const selectedAlumno = selectedAlumnoId
    ? alumnos.find((a) => a.id === selectedAlumnoId) ?? null
    : null;

  const handleSelectGrupo = (id: string) => {
    setSelectedGrupoId(id);
    setActiveTab("integrantes");
    setSelectedAlumnoId(null);
    setShowAddBand(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <GroupSidebar
        grupos={GRUPOS_MOCK}
        selectedId={selectedGrupoId}
        onSelect={handleSelectGrupo}
      />

      {/* ── Panel principal ────────────────────────────────── */}
      <main className="relative flex-1 h-full overflow-hidden flex flex-col">
        {/* fondo del color del grupo — cubre todo el panel */}
        <div
          className="absolute inset-0"
          style={{ background: headerColor }}
        />

        {/* ── Encabezado: nombre del grupo ─────────────────── */}
        <div 
          className="relative z-10 flex items-center"
          style={{ height: "clamp(80px, 8vh, 132px)", paddingLeft: "clamp(24px, 3.4vw, 49px)", padding: "clamp(16px, 3.5vw, 60px)" }}
        >
          <h1
            className="text-white font-normal leading-none"
            style={{ fontSize: "clamp(32px, 4.4vw, 64px)" }}
          >
            {showAddBand
              ? "AÑADIR PULSERA"
              : selectedAlumno
              ? `${grupo.nombre} / ${selectedAlumno.nombreCompleto}`
              : grupo.nombre}
          </h1>
        </div>

        {/* ── Área de contenido: tabs + panel blanco ─────── */}
        <div
          className="relative z-10 flex-1 flex flex-col overflow-hidden"
          style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
        >
          {/* Tab bar — se oculta en la vista de detalle o en el panel de añadir pulsera */}
          {!selectedAlumno && !showAddBand && (
            <TabBar active={activeTab} onChange={setActiveTab} />
          )}

          {/* Panel blanco con contenido */}
          <div
            className="flex-1 overflow-hidden bg-white"
            style={{ borderRadius: (selectedAlumno || showAddBand) ? 25 : "0 25px 25px 25px" }}
          >
            {showAddBand ? (
              <AddBandPanel
                onBack={() => setShowAddBand(false)}
                onExistingRecord={() => { /* TODO: navegar a registro existente */ }}
                onNewRecord={() => { /* TODO: navegar a nuevo registro */ }}
              />
            ) : selectedAlumno ? (
              <StudentView
                alumno={selectedAlumno}
                grupoNombre={grupo.nombre}
                grupoColor={headerColor}
                onBack={() => setSelectedAlumnoId(null)}
              />
            ) : (
              <>
                {activeTab === "integrantes" && (
                  <MembersTab
                    alumnos={alumnos}
                    stripColor={headerColor}
                    onSelectAlumno={setSelectedAlumnoId}
                    onAddMember={() => setShowAddBand(true)}
                  />
                )}

                {activeTab === "mapa" && (
                  <div className="flex h-full items-center justify-center text-[#3A3A3A] text-2xl">
                    Mapa — próximamente
                  </div>
                )}

                {activeTab === "docente" && (
                  <DocenteTab docente={docente} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
