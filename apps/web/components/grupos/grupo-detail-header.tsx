interface GrupoDetailHeaderProps {
  titulo: string;
}

export function GrupoDetailHeader({ titulo }: GrupoDetailHeaderProps) {
  return (
    <header className="pr-7 pb-4 shrink-0" style={{ marginTop: "15px", marginLeft: "28px" }}>
      <h1 className="text-[clamp(2.3rem,3.6vw,3.7rem)] font-medium text-white tracking-[0.03em] uppercase leading-none">
        {titulo}
      </h1>
    </header>
  );
}
