import { notFound } from "next/navigation";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { TabBar } from "@/components/grupos/tab-bar";
import { AsistenciaTabla } from "@/components/asistencia/asistencia-tabla";
import { getAsistencias, getGrupoById, getGrupos } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
  searchParams: Promise<{ fecha?: string }>;
}

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * /groups/[grupoId]/asistencia — Pestaña "Asistencia" del grupo.
 * Vista de solo lectura: refleja lo que ya calcula el upsert automático de
 * TelemetriaService, no permite confirmación manual todavía.
 */
export default async function AsistenciaPage({ params, searchParams }: Props) {
  const { grupoId } = await params;
  const { fecha } = await searchParams;
  const fechaSeleccionada = fecha ?? hoyIso();

  const [grupo, grupos, asistencias] = await Promise.all([
    getGrupoById(grupoId),
    getGrupos(),
    getAsistencias(grupoId, fechaSeleccionada),
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

        <div
          className="flex-1 overflow-hidden bg-white flex flex-col"
          style={{ borderRadius: "0 25px 25px 25px" }}
        >
          <AsistenciaTabla
            asistencias={asistencias}
            grupos={grupos}
            grupoSeleccionadoId={grupoId}
            fecha={fechaSeleccionada}
          />
        </div>
      </div>
    </>
  );
}
