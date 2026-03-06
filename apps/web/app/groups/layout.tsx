import { Sidebar } from "@/components/layout/sidebar";
import { FondoDinamico } from "@/components/layout/fondo-dinamico";

export const metadata = {
  title: "Grupos — Segurinite",
};

/**
 * Layout del dashboard de grupos.
 * Server Component: renderiza el sidebar (Client) y el fondo dinámico (Client)
 * que envuelven el contenido de cada página de grupos.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar izquierdo fijo */}
      <Sidebar />

      {/* Panel principal con fondo de color dinámico según el grupo activo */}
      <FondoDinamico>{children}</FondoDinamico>
    </div>
  );
}
