import Image from "next/image";
import Link from "next/link";
import { getMapas } from "@/lib/api/segurinite";

export default async function MapasPage() {
  const mapas = await getMapas();

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div
        className="shrink-0"
        style={{ padding: "clamp(24px, 3vw, 48px) clamp(32px, 6vw, 108px) 0" }}
      >
        <div
          className="flex items-center justify-between"
          style={{ paddingBottom: 18 }}
        >
          <h2
            className="text-[#3A3A3A] font-normal"
            style={{ fontSize: 24 }}
          >
            Mapas
          </h2>

          <Link href="/admin/mapas/nuevo" className="no-underline">
            <button
              className="border-none cursor-pointer font-normal text-[#3A3A3A]"
              style={{
                background: "#87D67B",
                borderRadius: 25,
                height: 52,
                padding: "0 28px",
                fontSize: 18,
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
              }}
              type="button"
            >
              + Subir nuevo mapa
            </button>
          </Link>
        </div>

        <div style={{ height: 1, background: "#3A3A3A" }} />
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "18px clamp(32px, 6vw, 108px) 40px" }}
      >
        {mapas.length === 0 ? (
          <p className="text-[#6A6A6A]" style={{ fontSize: 18 }}>
            Todavía no hay mapas cargados.
          </p>
        ) : (
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {mapas.map((mapa) => (
              <Link
                key={mapa.id}
                href={`/admin/mapas/${mapa.id}`}
                className="no-underline"
              >
                <div
                  className="overflow-hidden"
                  style={{ border: "1px solid #3A3A3A", borderRadius: 22 }}
                >
                  <div
                    className="relative w-full"
                    style={{ height: 160, background: "#EDEDED" }}
                  >
                    <Image
                      src={mapa.imagenUrl}
                      alt={mapa.nombre}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ padding: "12px 16px" }}>
                    <span className="text-[#3A3A3A]" style={{ fontSize: 18 }}>
                      {mapa.nombre}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
