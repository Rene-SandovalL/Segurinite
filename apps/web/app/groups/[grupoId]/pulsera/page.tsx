import { notFound } from "next/navigation";
import { FlujoPulsera } from "@/components/grupos/flujo-pulsera";
import { getGrupoById } from "@/lib/api/segurinite";

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

  const grupo = await getGrupoById(grupoId);
  if (!grupo) notFound();

  return <FlujoPulsera grupoId={grupoId} />;
}
