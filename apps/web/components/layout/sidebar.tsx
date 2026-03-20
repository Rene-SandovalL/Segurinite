"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { GrupoMock } from "@/lib/mock/grupos";
import { SidebarGrupoItem } from "./sidebar-grupo-item";

interface SidebarProps {
  grupos: GrupoMock[];
}

/**
 * Sidebar izquierdo del dashboard.
 * Detecta el grupo activo con usePathname() y usa Links internamente.
 */
export function Sidebar({ grupos }: SidebarProps) {
  const pathname = usePathname();
  // La ruta es /groups/[grupoId]/... — el grupoId está en el segmento índice 2
  const segmentos = pathname.split("/");
  const grupoIdActivo = segmentos[2] ?? "";

  return (
    <aside
      className="relative flex flex-col bg-white h-full shrink-0"
      style={{ width: "clamp(280px, 24vw, 463px)" }}
    >
      {/* ── Encabezado ───────────────────────────────────── */}
      <div className="shrink-0" style={{ padding: "22px 26px 0" }}>
        <div className="flex items-center justify-center">
          <Link
            href="/groups"
            className="flex items-center no-underline"
            style={{ gap: 8 }}
            aria-label="Ir a la vista inicial"
          >
            <Image
              src="/icons/logo.png"
              alt="Logo Segurinite"
              width={44}
              height={44}
              className="shrink-0"
              style={{ objectFit: "contain" }}
              priority
            />

            <span
              className="text-[#3A3A3A] font-normal whitespace-nowrap"
              style={{ fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1 }}
            >
              SEGURINITE
            </span>
          </Link>
        </div>

        <div style={{ height: 2, background: "#3A3A3A", marginTop: 12, marginInline: 6 }} />
      </div>

      {/* ── Lista de grupos ───────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden" style={{ marginTop: 20 }}>
        <div className="absolute inset-0 overflow-y-auto">
          <div
            className="flex flex-col"
            style={{ gap: 24, margin: "32px 28px 24px 28px" }}
          >
            {grupos.map((grupo) => (
              <SidebarGrupoItem
                key={grupo.id}
                grupo={grupo}
                activo={grupoIdActivo === grupo.id}
              />
            ))}

            {/* Botón + agregar grupo */}
            <Link
              href="/groups/nuevo"
              className="w-full flex items-center justify-center rounded-[25px] text-[#3A3A3A] font-normal no-underline"
              style={{
                height: 64,
                fontSize: "clamp(24px, 2.5vw, 36px)",
                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                background: grupoIdActivo === "nuevo" ? "#B8B8B8" : "#D9D9D9",
              }}
              aria-label="Crear nuevo grupo"
            >
              +
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
