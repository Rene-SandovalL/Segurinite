import { notFound } from "next/navigation";
import { GRUPOS_MOCK } from "@/lib/mock/grupos";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { AñadirPulsera } from "@/components/grupos/añadir-pulsera";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/pulsera — Panel para añadir una pulsera.
 * No muestra el TabBar. El botón ← regresa a la lista de integrantes.
 */
export default async function AñadirPulseraPage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = GRUPOS_MOCK.find((g) => g.id === grupoId);
  if (!grupo) notFound();

  return (
    <>
      <GrupoHeader titulo="AÑADIR PULSERA" />

      {/* Panel blanco — sin tabs, bordes redondeados en todas las esquinas */}
      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white" style={{ borderRadius: 25 }}>
          <AñadirPulsera />
        </div>
      </div>
    </>
  );
}
