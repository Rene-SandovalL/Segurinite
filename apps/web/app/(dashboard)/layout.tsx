import { Sidebar } from "../../components/layout/sidebar";
import { MainContent } from "../../components/layout/main-content";
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
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
}