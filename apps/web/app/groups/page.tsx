import { redirect } from "next/navigation";
import { GRUPOS_MOCK } from "@/lib/mock/grupos";

/**
 * /groups — Redirige automáticamente al primer grupo del listado.
 */
export default function GruposPage() {
  const primerGrupo = GRUPOS_MOCK[0];
  redirect(`/groups/${primerGrupo!.id}`);
}
