import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ grupoId: string }>;
}

export default async function GrupoPage({ params }: Props) {
  const { grupoId } = await params;
  redirect(`/grupos/${grupoId}/integrantes`);
}
