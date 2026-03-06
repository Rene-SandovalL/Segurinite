interface GrupoHeaderProps {
  titulo: string;
}

/**
 * Encabezado del panel principal del dashboard.
 * Renderiza el título del grupo (o breadcrumb) sobre el fondo de color dinámico.
 */
export function GrupoHeader({ titulo }: GrupoHeaderProps) {
  return (
    <div
      className="flex items-center shrink-0"
      style={{
        height: "clamp(80px, 8vh, 132px)",
        padding: "clamp(16px, 3.5vw, 60px)",
      }}
    >
      <h1
        className="text-white font-normal leading-none"
        style={{ fontSize: "clamp(32px, 4.4vw, 64px)" }}
      >
        {titulo}
      </h1>
    </div>
  );
}
