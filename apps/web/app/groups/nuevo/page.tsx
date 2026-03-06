import { GrupoHeader } from "@/components/grupos/grupo-header";
import { CrearGrupo } from "@/components/grupos/crear-grupo";

/**
 * /groups/nuevo — Formulario de creación de un nuevo grupo.
 * Ruta estática — tiene precedencia sobre /groups/[grupoId].
 */
export default function NuevoGrupoPage() {
  return (
    <>
      <GrupoHeader titulo="NUEVO GRUPO" />

      <div
        className="flex-1 overflow-hidden"
        style={{ padding: "0 clamp(16px, 3.5vw, 51px) clamp(16px, 3.5vw, 51px)" }}
      >
        <div className="h-full bg-white" style={{ borderRadius: 25 }}>
          <CrearGrupo />
        </div>
      </div>
    </>
  );
}
