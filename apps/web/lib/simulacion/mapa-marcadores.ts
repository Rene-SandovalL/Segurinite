import type { AlumnoMock } from "@/lib/mock/alumnos";
import { obtenerAlumnosEnRiesgoIds } from "@/lib/simulacion/alumnos-riesgo";
import { resolverColorHex } from "@/lib/mock/grupos";

export interface MarcadorMapa {
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

export function generarMarcadores(grupoId: string, alumnos: AlumnoMock[]): MarcadorMapa[] {
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

export function colorTextoSegunFondo(colorHex: string): string {
  const color = resolverColorHex(colorHex).replace("#", "");

  const r = Number.parseInt(color.slice(0, 2), 16);
  const g = Number.parseInt(color.slice(2, 4), 16);
  const b = Number.parseInt(color.slice(4, 6), 16);

  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.62 ? "#1E1E1E" : "#FFFFFF";
}

export function simularHeartRate(
  grupoId: string,
  alumnoId: string,
  fueraDeRango: boolean,
): number {
  const random = crearRandom(hashTexto(`${grupoId}-${alumnoId}-hr`));

  if (fueraDeRango) {
    return Math.round(randomEnRango(random, 112, 148));
  }

  return Math.round(randomEnRango(random, 66, 99));
}

export function simularTemperatura(
  grupoId: string,
  alumnoId: string,
  fueraDeRango: boolean,
): string {
  const random = crearRandom(hashTexto(`${grupoId}-${alumnoId}-temp`));

  if (fueraDeRango) {
    return randomEnRango(random, 37.8, 39.3).toFixed(1);
  }

  return randomEnRango(random, 36.1, 37.4).toFixed(1);
}
