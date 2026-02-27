import { DashboardContentShell } from "../../../../../components/layout/dashboard-content-shell";
import { AlumnoBackButton } from "../../../../../components/alumnos/alumno-back-button";
import { RegistroOptionCard } from "../../../../../components/pulseras/registro-option-card";

interface Props {
  params: Promise<{ grupoId: string }>;
}

export default async function AnadirPulseraPage({ params }: Props) {
  const { grupoId } = await params;

  return (
    <DashboardContentShell
      titulo="AÑADIR PULSERA"
      tabs={null}
      unirConTabs={false}
    >
      <div className="h-full flex flex-col px-10 py-6">
        <div className="w-full max-w-3xl mx-auto">
          <AlumnoBackButton href={`/grupos/${grupoId}/integrantes`} />
        </div>

        <p className="text-gray-600 text-xl text-center mt-3">
          Añadir pulsera a partir desde...
        </p>

        <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-4xl w-full">
          <RegistroOptionCard
            href={`/grupos/${grupoId}/anadir-pulsera/existente`}
            title="Registro Existente"
            iconSrc="/icons/registro_existente_icon.png"
            iconAlt="Seleccionar de registros existentes"
            headerColor="#6dd6a3"
          />
          <RegistroOptionCard
            href={`/grupos/${grupoId}/anadir-pulsera/nuevo`}
            title="Nuevo Registro"
            iconSrc="/icons/nuevo_registro_icon.png"
            iconAlt="Crear nuevo registro de alumno"
            headerColor="#00c4d4"
            iconContainerClassName="w-56 h-56"
            iconPaddingClassName="p-3"
          />
        </div>
        </div>
      </div>
    </DashboardContentShell>
  );
}
