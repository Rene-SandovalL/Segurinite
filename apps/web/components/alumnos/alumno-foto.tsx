"use client";

import Image from "next/image";
import { useState } from "react";

interface AlumnoFotoProps {
  fotoUrl?: string;
  iniciales: string;
  nombre: string;
}

export function AlumnoFoto({ fotoUrl, iniciales, nombre }: AlumnoFotoProps) {
  const [errorImagen, setErrorImagen] = useState(false);

  if (!fotoUrl || errorImagen) {
    return (
      <div
        className="relative w-full overflow-hidden bg-[#5a5a6a] flex items-center justify-center"
        style={{ height: "clamp(200px, 30vh, 320px)" }}
      >
        <span className="text-white text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-none">{iniciales}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(200px, 30vh, 320px)" }}>
      <Image
        src={fotoUrl}
        alt={`Foto de ${nombre}`}
        fill
        className="object-cover"
        onError={() => setErrorImagen(true)}
      />
    </div>
  );
}
