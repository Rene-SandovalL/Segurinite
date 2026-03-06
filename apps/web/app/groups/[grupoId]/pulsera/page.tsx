import { notFound } from "next/navigation";
import { GRUPOS_MOCK } from "@/lib/mock/grupos";
import { FlujoPulsera } from "@/components/grupos/flujo-pulsera";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/pulsera — Flujo de añadir pulsera.
 * El header y el contenido los gestiona FlujoPulsera (Client Component)
 * para poder cambiar el título dinámicamente según la pantalla activa.
 */
export default async function AñadirPulseraPage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = GRUPOS_MOCK.find((g) => g.id === grupoId);
  if (!grupo) notFound();

  return <FlujoPulsera grupoId={grupoId} />;
}
