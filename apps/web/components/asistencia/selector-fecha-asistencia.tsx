"use client";

import { usePathname, useRouter } from "next/navigation";

interface SelectorFechaAsistenciaProps {
  fecha: string;
}

export function SelectorFechaAsistencia({ fecha }: SelectorFechaAsistenciaProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    router.push(`${pathname}?fecha=${event.target.value}`);
  }

  return (
    <input
      type="date"
      value={fecha}
      onChange={handleChange}
      className="bg-white text-[#3A3A3A] focus:outline-none"
      style={{
        border: "1px solid #3A3A3A",
        borderRadius: 25,
        height: 44,
        padding: "0 16px",
        fontSize: 15,
      }}
      aria-label="Elegir fecha de asistencia"
    />
  );
}
