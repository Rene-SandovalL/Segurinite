import { notFound } from "next/navigation";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { TabBar } from "@/components/grupos/tab-bar";
import { IntegrantesLista } from "@/components/alumnos/integrantes-lista";
import { getAlumnosByGrupo, getGrupoById } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId] — Pestaña "Integrantes" del grupo.
 * Server Component: obtiene datos del grupo y sus alumnos.
 */
export default async function IntegrantesPage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = await getGrupoById(grupoId);
  if (!grupo) notFound();

  const alumnos = await getAlumnosByGrupo(grupoId);
  const colorFranja = grupo.color;

  return (
    <>
      <GrupoHeader titulo={grupo.nombre} />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <TabBar grupoId={grupoId} />

        {/* Panel blanco con esquina superior izquierda recta (apoyada en la tab activa) */}
        <div
          className="flex-1 overflow-hidden bg-white"
          style={{ borderRadius: "0 25px 25px 25px" }}
        >
          <IntegrantesLista alumnos={alumnos} grupoId={grupoId} colorFranja={colorFranja} />
        </div>
      </div>
    </>
  );
}
