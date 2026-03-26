"use client";

import Image from "next/image";

interface LoadingPantallaProps {
  visible: boolean;
  fase: "entrada" | "salida";
}

export function LoadingPantalla({ visible, fase }: LoadingPantallaProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-white">
      <div className={`flex flex-col items-center ${fase === "salida" ? "auth-salida" : "auth-entrada"}`}>
        <Image
          src="/segurinite-logo.svg"
          alt="Segurinite"
          width={280}
          height={72}
          priority
          style={{ height: "auto" }}
        />

        <div className="mt-5 h-10 w-10 rounded-full border-4 border-[#E2E6FF] border-t-[#575EAA] auth-spinner" />
      </div>
    </div>
  );
}
