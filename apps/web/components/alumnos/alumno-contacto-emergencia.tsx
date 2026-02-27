import { AlumnoField } from "./alumno-field";
import type { ContactoEmergencia } from "../../types/alumno";

interface AlumnoContactoEmergenciaProps {
  contactos?: ContactoEmergencia[];
}

export function AlumnoContactoEmergencia({ contactos }: AlumnoContactoEmergenciaProps) {
  const lista = contactos && contactos.length > 0 ? contactos : [];

  return (
    <section className="mt-10">
      <h3 className="text-[15px] text-gray-600 font-medium mb-2">
        Contacto(s) de emergencia
      </h3>
      <div className="border-t border-gray-400/50 mb-5" />

      {lista.length === 0 ? (
        <div className="rounded-2xl bg-[#f4f4f5] px-3 py-2 text-gray-500 text-[clamp(0.95rem,1.1vw,1.1rem)]">
          Sin contactos registrados
        </div>
      ) : (
        <div className="space-y-4">
          {lista.map((contacto, index) => (
            <div key={`${contacto.nombre}-${index}`} className="space-y-4">
              <div className="flex items-start gap-4 min-w-0 flex-wrap md:flex-nowrap">
                <AlumnoField label="Nombre" value={contacto.nombre} className="flex-1 min-w-56" />
                <AlumnoField label="Edad" value={String(contacto.edad)} className="w-20 shrink-0" />
                <AlumnoField label="Fecha de Nacimiento" value={contacto.fechaNacimiento} className="w-44" />
              </div>
              <div className="min-w-0">
                <AlumnoField label="Num. Telefono" value={contacto.telefono} className="w-56" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
