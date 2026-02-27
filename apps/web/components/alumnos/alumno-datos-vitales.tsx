import { AlumnoVitalCard } from "./alumno-vital-card";
import type { DatosVitales } from "../../types/alumno";

interface AlumnoDatosVitalesProps {
  datosVitales?: DatosVitales;
}

export function AlumnoDatosVitales({ datosVitales }: AlumnoDatosVitalesProps) {
  const vitals = datosVitales ?? {
    presionSys: 0,
    presionDia: 0,
    pulso: 0,
    temperatura: 0,
    ultimaLectura: "Sin datos",
  };

  return (
    <div className="mt-6 w-full">
      <h3 className="text-white text-xl leading-none text-center font-semibold mb-5">
        Datos Vitales
      </h3>

      <AlumnoVitalCard title="Presion arterial" subtitle={`(${vitals.ultimaLectura})`} borderColor="#c44040">
        <div className="space-y-1 text-xl leading-none">
          <div className="flex items-center justify-between border-b border-white/25 pb-1.5">
            <span className="font-semibold">SYS</span>
            <span>{vitals.presionSys}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/25 pb-1.5">
            <span className="font-semibold">DIA</span>
            <span>{vitals.presionDia}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">PULSE</span>
            <span>{vitals.pulso}</span>
          </div>
        </div>
      </AlumnoVitalCard>

      <div className="mt-5">
        <AlumnoVitalCard title="Temperatura" borderColor="#5c5ca8">
          <p className="text-center text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none text-[#9db0ff] mt-1">
            {vitals.temperatura.toFixed(1)}°C
          </p>
        </AlumnoVitalCard>
      </div>
    </div>
  );
}
