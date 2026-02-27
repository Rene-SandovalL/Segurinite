"use client";

import { type ReactNode } from "react";
import { useBgGrupoActivo } from "../../lib/use-bg-grupo-activo";

interface DashboardShellProps {
  children: ReactNode;
}

/** Wrapper client-side que aplica el color de fondo según el grupo activo. */
export function DashboardShell({ children }: DashboardShellProps) {
  const bgColor = useBgGrupoActivo();

  return (
    <div
      className="h-screen flex overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </div>
  );
}
