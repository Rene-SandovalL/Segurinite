import Link from "next/link";
import type { Grupo } from "../../types/grupo";
import { GrupoCard } from "./grupo-card";

interface GrupoCardListProps {
  grupos: Grupo[];
  grupoActivoId?: string;
}

export function GrupoCardList({ grupos, grupoActivoId }: GrupoCardListProps) {
  return (
    <>
      {grupos.map((grupo) => (
        <Link key={grupo.id} href={`/grupos/${grupo.id}/integrantes`}>
          <GrupoCard grupo={grupo} activo={grupo.id === grupoActivoId} />
        </Link>
      ))}
    </>
  );
}
