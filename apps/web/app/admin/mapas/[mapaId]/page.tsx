import { notFound } from "next/navigation";
import { getBeaconsSinPosicion, getMapaById, getZonas } from "@/lib/api/segurinite";
import { MapaEdicion } from "@/components/mapas/mapa-edicion";

interface MapaDetallePageProps {
  params: Promise<{ mapaId: string }>;
}

export default async function MapaDetallePage({ params }: MapaDetallePageProps) {
  const { mapaId } = await params;
  const idNumerico = Number(mapaId);

  if (!Number.isInteger(idNumerico)) {
    notFound();
  }

  const [mapa, beaconsSinPosicion, zonas] = await Promise.all([
    getMapaById(idNumerico),
    getBeaconsSinPosicion(),
    getZonas(),
  ]);

  if (!mapa) {
    notFound();
  }

  return (
    <MapaEdicion
      key={mapa.id}
      mapa={mapa}
      beaconsSinPosicionIniciales={beaconsSinPosicion}
      zonas={zonas}
    />
  );
}
