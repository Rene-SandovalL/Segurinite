import { notFound } from "next/navigation";
import { DashboardContentShell } from "../../../../../../components/layout/dashboard-content-shell";
import { AlumnoDetailShell } from "../../../../../../components/alumnos/alumno-detail-shell";
import { alumnosMock, gruposMock } from "../../../../../../lib/mock-data";
import type { Grupo } from "../../../../../../types/grupo";
import type { Alumno } from "../../../../../../types/alumno";

interface Props {
  params: Promise<{ grupoId: string; alumnoId: string }> | { grupoId: string; alumnoId: string };
}

export default async function AlumnoDetallePage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);

  const grupo = gruposMock.find((g: Grupo) => g.id === resolvedParams.grupoId);
  const alumno = alumnosMock.find(
    (a: Alumno) => a.id === resolvedParams.alumnoId && a.grupoId === resolvedParams.grupoId,
  );

  if (!grupo || !alumno) {
    notFound();
  }

  return (
    <DashboardContentShell
      titulo={`${grupo.nombre} / ${alumno.nombre} ${alumno.apellido}`}
      tabs={null}
      unirConTabs={false}
    >
      <AlumnoDetailShell alumno={alumno} grupoId={grupo.id} />
    </DashboardContentShell>
  );
}
