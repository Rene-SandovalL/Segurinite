"use client";

import GroupButton from "./GroupButton";
import type { GrupoMock } from "@/lib/mock/grupos";

interface GroupSidebarProps {
  grupos: GrupoMock[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddGroup?: () => void;
}

/** Sidebar izquierdo: logo, lista de grupos y botón agregar */
export default function GroupSidebar({
  grupos,
  selectedId,
  onSelect,
  onAddGroup,
}: GroupSidebarProps) {
  return (
    <aside
      className="relative flex flex-col bg-white h-full"
      style={{ width: "clamp(280px, 24vw, 463px)", flexShrink: 0 }}
    >
      {/* ── encabezado ───────────────────────────────────── */}
      <div className="relative h-40.5 shrink-0 overflow-hidden">
        {/* botón menú */}
        <button
          className="absolute left-8.25 top-8 w-16 h-16 rounded-full bg-white flex items-center justify-center focus:outline-none"
          style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          aria-label="Menú"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M2.667 10.667H18.667M2.667 5.333H18.667M2.667 16H18.667"
              stroke="#1E1E1E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* nombre del sistema */}
        <div className="absolute left-1/2 -translate-x-1/2 top-9.75 flex items-center">
          <span
            className="text-[#3A3A3A] font-normal text-center whitespace-nowrap"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            SEGURINITE
          </span>
        </div>

        {/* línea divisora */}
        <div
          className="absolute bottom-0 h-0.5 bg-[#3A3A3A]"
          style={{ left: 33, right: 33 }}
        />
      </div>

      {/* ── lista de grupos ───────────────────────────────── */}
      {/* contenedor scroll */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {/* contenedor interior con margen para que las tarjetas no toquen los bordes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "32px 28px 24px 28px" }}>
          {grupos.map((g) => (
            <GroupButton
              key={g.id}
              grupo={g}
              selected={selectedId === g.id}
              onClick={() => onSelect(g.id)}
            />
          ))}

          {/* botón + agregar grupo */}
          <button
            onClick={onAddGroup}
            style={{
              width: "100%",
              height: 64,
              borderRadius: 25,
              background: "#D9D9D9",
              color: "#3A3A3A",
              fontSize: 36,
              fontWeight: 400,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
            }}
            aria-label="Agregar grupo"
          >
            +
          </button>
        </div>
      </div>
    </aside>
  );
}
