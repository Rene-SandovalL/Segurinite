import { Sidebar } from "../../components/layout/sidebar";
import { gruposMock } from "../../lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#575EAA] flex overflow-hidden">
      {/* Sidebar — pegado a la izquierda, ocupa todo el alto */}
      <Sidebar grupos={gruposMock} />

      {/* Contenido dinámico */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}