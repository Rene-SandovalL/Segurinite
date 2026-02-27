import { redirect } from "next/navigation";
import { gruposMock } from "../../../lib/mock-data";

export default function GruposPage() {
  const primerGrupo = gruposMock[0]?.id ?? "4a";
  redirect(`/grupos/${primerGrupo}/integrantes`);
}
