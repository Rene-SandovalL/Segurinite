import { redirect } from "next/navigation";
import { getGrupos } from "@/lib/api/segurinite";

/**
 * /groups — Redirige automáticamente al primer grupo del listado.
 */
export default async function GruposPage() {
  const grupos = await getGrupos();
  const primerGrupo = grupos[0];

  if (!primerGrupo) {
    redirect("/groups/nuevo");
  }

  redirect(`/groups/${primerGrupo!.id}`);
}
