import { Sidebar } from "../../components/layout/sidebar";

/**
 * Layout del Dashboard de Segurinite.
 *
 * ┌──────────────────────────────────────────┐
 * │  fondo morado oscuro (#3d3d5c)           │
 * │  ┌──────────┬───────────────────────┐    │
 * │  │ Sidebar  │  {children}           │    │
 * │  │ (fijo)   │  (contenido de ruta)  │    │
 * │  └──────────┴───────────────────────┘    │
 * └──────────────────────────────────────────┘
 *
 * NOTA: El Sidebar necesita estado para saber qué grupo está activo.
 * Por ahora recibe los datos de prueba directamente.
 * Cuando haya API, este layout obtendrá los grupos del servidor (Server Component).
 */
import { gruposMock } from "../../lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#575EAA] flex overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar grupos={gruposMock} />

      {/* Contenido dinámico según la ruta activa */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}