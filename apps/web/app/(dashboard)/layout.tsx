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
      <Sidebar grupos={gruposMock} />

      <MainContent>
        {children}
      </MainContent>
    </div>
  );
}