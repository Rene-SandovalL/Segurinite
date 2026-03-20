import { notFound } from "next/navigation";
import { getDocenteByGrupo } from "@/lib/mock/docentes";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { TabBar } from "@/components/grupos/tab-bar";
import { DocentePerfil } from "@/components/docente/docente-perfil";
import { getGrupoById } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/docente — Pestaña "Docente" del grupo.
 * Muestra el perfil del docente asignado al grupo.
 */
export default async function DocentePage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = await getGrupoById(grupoId);
  if (!grupo) notFound();

  const docente = getDocenteByGrupo(grupoId);

  return (
    <>
      <GrupoHeader titulo={grupo.nombre} />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <TabBar grupoId={grupoId} />

        <div
          className="flex-1 overflow-hidden bg-white"
          style={{ borderRadius: "0 25px 25px 25px" }}
        >
          <DocentePerfil docente={docente} />
        </div>
      </div>
    </>
  );
}
