import { notFound } from "next/navigation";
import { GRUPOS_MOCK } from "@/lib/mock/grupos";
import { getAlumnosByGrupo } from "@/lib/mock/alumnos";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { AlumnoDetalle } from "@/components/alumnos/alumno-detalle";

interface Props {
  params: Promise<{ grupoId: string; alumnoId: string }>;
}

/**
 * /groups/[grupoId]/alumnos/[alumnoId] — Vista de detalle del alumno.
 * No muestra el TabBar. El botón ← está dentro de AlumnoDetalle (usa router.back()).
 */
export default async function AlumnoDetallePage({ params }: Props) {
  const { grupoId, alumnoId } = await params;

  const grupo = GRUPOS_MOCK.find((g) => g.id === grupoId);
  if (!grupo) notFound();

  const alumnos = getAlumnosByGrupo(grupoId);
  const alumno = alumnos.find((a) => a.id === alumnoId);
  if (!alumno) notFound();

  const tituloHeader = `${grupo.nombre} / ${alumno.nombreCompleto ?? `${alumno.nombre} ${alumno.apellido}`}`;

  return (
    <>
      <GrupoHeader titulo={tituloHeader} />

      {/* Panel blanco con bordes redondeados en todas las esquinas (sin tabs) */}
      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <AlumnoDetalle alumno={alumno} />
      </div>
    </>
  );
}
