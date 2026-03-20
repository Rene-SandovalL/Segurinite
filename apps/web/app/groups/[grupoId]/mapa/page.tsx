import { notFound } from "next/navigation";
import Image from "next/image";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { TabBar } from "@/components/grupos/tab-bar";
import { getGrupoById } from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
}

/**
 * /groups/[grupoId]/mapa — Pestaña "Mapa" del grupo.
 * Próximamente: visualización del mapa en tiempo real.
 */
export default async function MapaPage({ params }: Props) {
  const { grupoId } = await params;

  const grupo = await getGrupoById(grupoId);
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
          style={{ borderRadius: "0 25px 25px 25px", padding: 16 }}
        >
          <div className="flex-1 overflow-hidden relative" style={{ borderRadius: 16 }}>
            <Image
              src="/mapa.jpeg"
              alt="Mapa del grupo"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
