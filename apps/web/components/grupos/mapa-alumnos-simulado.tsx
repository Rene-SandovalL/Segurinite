import Image from "next/image";
import Link from "next/link";
import type { AlumnoMock } from "@/lib/mock/alumnos";
import { obtenerAlumnosEnRiesgoIds } from "@/lib/simulacion/alumnos-riesgo";

interface MapaAlumnosSimuladoProps {
  grupoId: string;
  alumnos: AlumnoMock[];
}

interface MarcadorMapa {
  alumno: AlumnoMock;
  x: number;
  y: number;
  fueraDeRango: boolean;
}

interface Punto {
  x: number;
  y: number;
}

function hashTexto(texto: string): number {
  let hash = 2166136261;

  for (let i = 0; i < texto.length; i += 1) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function crearRandom(seedInicial: number): () => number {
  let seed = seedInicial >>> 0;

  return () => {
    seed += 0x6d2b79f5;
    let temporal = seed;
    temporal = Math.imul(temporal ^ (temporal >>> 15), temporal | 1);
    temporal ^= temporal + Math.imul(temporal ^ (temporal >>> 7), temporal | 61);

    return ((temporal ^ (temporal >>> 14)) >>> 0) / 4294967296;
  };
}

function randomEnRango(random: () => number, minimo: number, maximo: number): number {
  return minimo + random() * (maximo - minimo);
}

function distanciaCuadrada(a: Punto, b: Punto): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function posicionNormal(random: () => number): Punto {
  return {
    x: randomEnRango(random, 12, 88),
    y: randomEnRango(random, 16, 84),
  };
}

function posicionFueraDeRango(random: () => number): Punto {
  const zona = Math.floor(random() * 4);

  switch (zona) {
    case 0:
      return {
        x: randomEnRango(random, 4, 12),
        y: randomEnRango(random, 20, 88),
      };
    case 1:
      return {
        x: randomEnRango(random, 88, 96),
        y: randomEnRango(random, 20, 88),
      };
    case 2:
      return {
        x: randomEnRango(random, 10, 92),
        y: randomEnRango(random, 4, 12),
      };
    default:
      return {
        x: randomEnRango(random, 10, 92),
        y: randomEnRango(random, 88, 96),
      };
  }
}

function generarMarcadores(grupoId: string, alumnos: AlumnoMock[]): MarcadorMapa[] {
  if (alumnos.length === 0) {
    return [];
  }

  const alumnosOrdenados = [...alumnos].sort((alumnoA, alumnoB) =>
    alumnoA.id.localeCompare(alumnoB.id),
  );

  const semillaBase = hashTexto(
    `${grupoId}-${alumnosOrdenados.map((alumno) => alumno.id).join("|")}`,
  );
  const random = crearRandom(semillaBase);
  const alumnosEnRiesgoIds = obtenerAlumnosEnRiesgoIds(grupoId, alumnosOrdenados);

  const puntosGenerados: Punto[] = [];
  const marcadores: MarcadorMapa[] = [];

  const distanciaMinima = alumnosOrdenados.length > 16 ? 4.2 : 5.8;
  const distanciaMinimaCuadrada = distanciaMinima * distanciaMinima;

  alumnosOrdenados.forEach((alumno) => {
    const fueraDeRango = alumnosEnRiesgoIds.has(alumno.id);

    let punto = fueraDeRango ? posicionFueraDeRango(random) : posicionNormal(random);

    for (let intento = 0; intento < 45; intento += 1) {
      const candidato = fueraDeRango ? posicionFueraDeRango(random) : posicionNormal(random);

      const hayChoque = puntosGenerados.some(
        (existente) => distanciaCuadrada(candidato, existente) < distanciaMinimaCuadrada,
      );

      if (!hayChoque) {
        punto = candidato;
        break;
      }
    }

    puntosGenerados.push(punto);
    marcadores.push({
      alumno,
      x: punto.x,
      y: punto.y,
      fueraDeRango,
    });
  });

  return marcadores;
}

function nombreAlumno(alumno: AlumnoMock): string {
  const nombre = alumno.nombreCompleto?.trim();
  if (nombre) {
    return nombre;
  }

  return `${alumno.nombre} ${alumno.apellido}`.trim();
}

export function MapaAlumnosSimulado({ grupoId, alumnos }: MapaAlumnosSimuladoProps) {
  const marcadores = generarMarcadores(grupoId, alumnos);

  return (
    <div
      className="flex-1 overflow-hidden bg-white flex flex-col"
      style={{ borderRadius: "0 25px 25px 25px", paddingTop: 24, paddingInline: 10, paddingBottom: 10 }}
    >

      <div
        className="relative flex-1 overflow-hidden"
        style={{ borderRadius: 30, boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", marginInline: 4, marginBottom: 4 }}
      >
        <Image
          src="/mapa.jpeg"
          alt="Mapa del grupo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {marcadores.map((marcador) => {
          const colorBorde = marcador.fueraDeRango ? "#E56363" : "#3A3A3A";
          const sombra = marcador.fueraDeRango
            ? "0 0 4px 4px #FF6060"
            : "0 4px 4px 0 rgba(0,0,0,0.25)";

          return (
            <Link
              key={marcador.alumno.id}
              href={`/groups/${grupoId}/alumnos/${marcador.alumno.id}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${marcador.x}%`, top: `${marcador.y}%` }}
              aria-label={`Ver información de ${nombreAlumno(marcador.alumno)}`}
            >
              <span
                className="flex items-center justify-center rounded-full transition-all duration-200 ease-out w-6 h-6 group-hover:w-14 group-hover:h-14 group-focus-visible:w-14 group-focus-visible:h-14"
                style={{
                  background: "#575EAA",
                  border: `2px solid ${colorBorde}`,
                  boxShadow: sombra,
                }}
              >
                <span
                  className="text-white font-normal select-none pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  {marcador.alumno.iniciales}
                </span>
              </span>
            </Link>
          );
        })}

        {marcadores.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="bg-white/70 text-[#3A3A3A] rounded-[14px]"
              style={{ padding: "8px 14px", fontSize: 16 }}
            >
              Este grupo aún no tiene alumnos para mostrar en el mapa.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}