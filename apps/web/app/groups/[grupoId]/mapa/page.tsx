import { notFound } from "next/navigation";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { MapaAlumnosSimulado } from "@/components/grupos/mapa-alumnos-simulado";
import { TabBar } from "@/components/grupos/tab-bar";
import { getAlumnosByGrupo, getGrupoById } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/mapa — Pestaña "Mapa" del grupo.
 * Próximamente: visualización del mapa en tiempo real.
 */
export default async function MapaPage({ params }: Props) {
  const { grupoId } = await params;

  const [grupo, alumnos] = await Promise.all([
    getGrupoById(grupoId),
    getAlumnosByGrupo(grupoId),
  ]);

  if (!grupo) notFound();

  return (
    <>
      <GrupoHeader titulo={grupo.nombre} />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <TabBar grupoId={grupoId} />

        <MapaAlumnosSimulado grupoId={grupoId} alumnos={alumnos} />
      </div>
    </>
  );
}
