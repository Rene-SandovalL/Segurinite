import { Sidebar } from "../../components/layout/sidebar";
import { MainContent } from "../../components/layout/main-content";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { gruposMock } from "../../lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <Sidebar grupos={gruposMock} />

      <MainContent>
        {children}
      </MainContent>
    </DashboardShell>
  );
}