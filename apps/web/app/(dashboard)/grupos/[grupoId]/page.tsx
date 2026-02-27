import { redirect } from "next/navigation";

interface Props {
  params: { grupoId: string };
}

export default function GrupoPage({ params }: Props) {
  redirect(`/grupos/${params.grupoId}/integrantes`);
}
