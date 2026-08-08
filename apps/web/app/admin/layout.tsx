import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Administración — Segurinite",
};

/**
 * Layout de la sección de administración (mapas/beacons).
 * A diferencia de /groups, no está ligado a un grupoId — es una vista
 * de nivel superior, así que no reutiliza Sidebar/FondoDinamico/AlertasProvider.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "#575EAA" }}
    >
      <header
        className="flex items-center shrink-0"
        style={{ padding: "20px clamp(16px, 3.5vw, 51px)", gap: 16 }}
      >
        <Link
          href="/groups"
          className="flex items-center no-underline"
          style={{ gap: 8 }}
          aria-label="Volver a grupos"
        >
          <Image
            src="/icons/logo.png"
            alt="Logo Segurinite"
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
          />
          <span
            className="text-white font-normal"
            style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}
          >
            Segurinite
          </span>
        </Link>
        <span className="text-white" style={{ opacity: 0.6, fontSize: 20 }}>
          /
        </span>
        <span
          className="text-white font-normal"
          style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}
        >
          Administración de mapas
        </span>
      </header>

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div
          className="h-full bg-white overflow-y-auto"
          style={{ borderRadius: 25 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
