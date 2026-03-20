import { notFound } from "next/navigation";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { NuevoRegistroAlumnoPanel } from "@/components/alumnos/nuevo-registro-alumno-panel";
import { getGrupoById } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/nuevo-registro — Formulario para registrar un alumno nuevo.
 */
export default async function NuevoRegistroAlumnoPage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = await getGrupoById(grupoId);
  if (!grupo) notFound();

  return (
    <>
      <GrupoHeader titulo="AÑADIR ALUMNO/NUEVO REGISTRO" />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white overflow-hidden" style={{ borderRadius: 25 }}>
          <NuevoRegistroAlumnoPanel grupoId={grupoId} />
        </div>
      </div>
    </>
  );
}
