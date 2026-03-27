import type { AlumnoMock } from "@/lib/mock/alumnos";

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

function shuffleIndices(total: number, random: () => number): number[] {
  const indices = Array.from({ length: total }, (_, index) => index);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }

  return indices;
}

export function obtenerAlumnosEnRiesgoIds(
  grupoId: string,
  alumnos: AlumnoMock[],
): Set<string> {
  if (alumnos.length === 0) {
    return new Set();
  }

  const alumnosOrdenados = [...alumnos].sort((alumnoA, alumnoB) =>
    alumnoA.id.localeCompare(alumnoB.id),
  );

  const semillaBase = hashTexto(
    `${grupoId}-${alumnosOrdenados.map((alumno) => alumno.id).join("|")}`,
  );
  const random = crearRandom(semillaBase);

  const riesgoIds = new Set(
    alumnosOrdenados
      .filter((alumno) => alumno.estado === "peligro")
      .map((alumno) => alumno.id),
  );

  const objetivoRiesgo = Math.min(
    alumnosOrdenados.length,
    alumnosOrdenados.length === 1 ? 1 : Math.max(2, riesgoIds.size),
  );

  if (riesgoIds.size >= objetivoRiesgo) {
    return riesgoIds;
  }

  const indicesDisponibles = shuffleIndices(alumnosOrdenados.length, random).filter(
    (index) => !riesgoIds.has(alumnosOrdenados[index]?.id ?? ""),
  );

  for (const index of indicesDisponibles) {
    const alumno = alumnosOrdenados[index];

    if (!alumno) {
      continue;
    }

    riesgoIds.add(alumno.id);

    if (riesgoIds.size >= objetivoRiesgo) {
      break;
    }
  }

  return riesgoIds;
}
