import type { DatosVitales } from "@/types/alumno";

interface AlumnoVitalesProps {
  vitales?: DatosVitales;
}

/**
 * Panel derecho del detalle del alumno.
 * Muestra foto placeholder y tarjetas de datos vitales (presión arterial y temperatura).
 */
export function AlumnoVitales({ vitales }: AlumnoVitalesProps) {
  return (
    <div
      className="flex flex-col overflow-hidden flex-1"
      style={{ background: "#3A3A3A" }}
    >
      {/* Foto placeholder */}
      <div
        className="w-full shrink-0"
        style={{ height: "32%", background: "#D9D9D9" }}
      />

      {/* Área de vitales — scrollable */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center"
        style={{ padding: "10px 16px 20px", gap: 12 }}
      >
        <span
          className="text-white font-normal text-center"
          style={{ fontSize: "clamp(20px, 2.5vw, 38px)" }}
        >
          Datos Vitales
        </span>

        {/* ── Tarjeta: Presión arterial (borde rojo) ── */}
        <div
          className="flex flex-col"
          style={{
            width: "90%",
            background: "#3A3A3A",
            borderRadius: 22,
            border: "4px solid #FA3A3A",
            padding: "10px 18px 14px",
          }}
        >
          <div className="text-center pb-0.5">
            <span className="text-white" style={{ fontSize: "clamp(16px, 1.8vw, 28px)" }}>
              Presion arterial
            </span>
          </div>
          <div className="text-center pb-1.5">
            <span className="text-white" style={{ fontSize: "clamp(11px, 1.2vw, 18px)" }}>
              ({vitales?.ultimaLectura ?? "—"})
            </span>
          </div>

          <div className="h-px bg-[#6A6A6A]" />

          {[
            { etiqueta: "SYS",   valor: vitales?.presionSys },
            { etiqueta: "DIA",   valor: vitales?.presionDia },
            { etiqueta: "PULSE", valor: vitales?.pulso },
          ].map(({ etiqueta, valor }, i, lista) => (
            <div key={etiqueta}>
              <div
                className="flex justify-between items-center"
                style={{ padding: "7px 6px" }}
              >
                <span className="text-white" style={{ fontSize: "clamp(14px, 1.8vw, 30px)" }}>
                  {etiqueta}
                </span>
                <span className="text-white" style={{ fontSize: "clamp(14px, 1.8vw, 30px)" }}>
                  {valor ?? "—"}
                </span>
              </div>
              {i < lista.length - 1 && <div className="h-px bg-[#6A6A6A]" />}
            </div>
          ))}
        </div>

        {/* ── Tarjeta: Temperatura (borde azul) ── */}
        <div
          className="flex flex-col items-center"
          style={{
            width: "90%",
            background: "#3A3A3A",
            borderRadius: 22,
            border: "4px solid #575EAA",
            padding: "10px 18px 16px",
            gap: 4,
          }}
        >
          <span className="text-white" style={{ fontSize: "clamp(16px, 1.8vw, 32px)" }}>
            Temperatura
          </span>
          <span className="text-white" style={{ fontSize: "clamp(26px, 3.5vw, 56px)" }}>
            {vitales ? `${vitales.temperatura} °C` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
