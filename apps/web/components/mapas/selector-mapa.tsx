"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MapaMock } from "@/lib/mock/mapas";

interface SelectorMapaProps {
  mapas: MapaMock[];
  mapaSeleccionadoId: number;
}

export function SelectorMapa({ mapas, mapaSeleccionadoId }: SelectorMapaProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mapaId", event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={mapaSeleccionadoId}
      onChange={handleChange}
      className="bg-white text-[#3A3A3A] focus:outline-none"
      style={{
        border: "1px solid #3A3A3A",
        borderRadius: 25,
        height: 44,
        padding: "0 16px",
        fontSize: 15,
      }}
      aria-label="Elegir mapa a mostrar"
    >
      {mapas.map((mapa) => (
        <option key={mapa.id} value={mapa.id}>
          {mapa.nombre}
        </option>
      ))}
    </select>
  );
}
