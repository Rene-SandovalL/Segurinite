import Link from "next/link";
import { notFound } from "next/navigation";
import { GrupoHeader } from "@/components/grupos/grupo-header";
import { TabBar } from "@/components/grupos/tab-bar";
import { MapaEdicion } from "@/components/mapas/mapa-edicion";
import { SelectorMapa } from "@/components/mapas/selector-mapa";
import {
  getAlumnosMapa,
  getBeaconsSinPosicion,
  getGrupoById,
  getMapaById,
  getMapas,
  getZonas,
} from "@/lib/api/segurinite";

interface Props {
  params: Promise<{ grupoId: string }>;
  searchParams: Promise<{ mapaId?: string }>;
}

/**
 * /groups/[grupoId]/mapa — Pestaña "Mapa" del grupo.
 * Muestra el mapa real (subido en /admin/mapas) con los beacons ya
 * posicionados. Los mapas no están ligados a un grupo, así que se puede
 * elegir cuál mostrar con el selector.
 */
export default async function MapaPage({ params, searchParams }: Props) {
  const { grupoId } = await params;
  const { mapaId } = await searchParams;

  const [grupo, mapas, alumnosMapa] = await Promise.all([
    getGrupoById(grupoId),
    getMapas(),
    getAlumnosMapa(grupoId),
  ]);

  if (!grupo) notFound();

  const idSeleccionado = mapaId ? Number(mapaId) : mapas[0]?.id;

  const [mapaSeleccionado, beaconsSinPosicion, zonas] = idSeleccionado
    ? await Promise.all([getMapaById(idSeleccionado), getBeaconsSinPosicion(), getZonas()])
    : [undefined, [], []];

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
          <div
            className="shrink-0 flex items-center justify-end flex-wrap"
            style={{ padding: "20px clamp(20px, 3vw, 48px) 0", gap: 12 }}
          >
            {mapas.length > 0 && idSeleccionado !== undefined && (
              <SelectorMapa mapas={mapas} mapaSeleccionadoId={idSeleccionado} />
            )}

            <Link
              href="/admin/mapas/nuevo"
              className="flex items-center justify-center no-underline font-normal text-[#3A3A3A]"
              style={{
                background: "#87D67B",
                borderRadius: 25,
                height: 44,
                padding: "0 20px",
                fontSize: 15,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
            >
              + Nuevo mapa
            </Link>

            <Link
              href="/admin/mapas"
              className="flex items-center justify-center no-underline font-normal text-[#3A3A3A]"
              style={{
                background: "#D9D9D9",
                borderRadius: 25,
                height: 44,
                padding: "0 20px",
                fontSize: 15,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
            >
              Administrar mapas
            </Link>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {!mapaSeleccionado ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#6A6A6A]" style={{ fontSize: 18 }}>
                  {mapas.length === 0
                    ? "Todavía no hay mapas cargados. Subí uno para empezar."
                    : "El mapa seleccionado no existe."}
                </p>
              </div>
            ) : (
              <MapaEdicion
                key={mapaSeleccionado.id}
                mapa={mapaSeleccionado}
                beaconsSinPosicionIniciales={beaconsSinPosicion}
                zonas={zonas}
                grupoId={grupoId}
                alumnosMapa={alumnosMapa}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
