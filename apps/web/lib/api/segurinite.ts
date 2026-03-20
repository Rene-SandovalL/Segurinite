import type { AlumnoMock } from "@/lib/mock/alumnos";
import type { GrupoColor, GrupoMock } from "@/lib/mock/grupos";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface GrupoApiResponse {
  id: number;
  nombre: string;
  color: GrupoColor;
  totalAlumnos: number;
}

interface AlumnoContactoApiResponse {
  tipo: "TUTOR" | "EMERGENCIA";
  orden: number | null;
  parentesco: string | null;
  nombre: string;
  telefono: string;
  fechaNacimiento: string | null;
  direccion: string | null;
  esTutor: boolean;
}

interface AlumnoApiResponse {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
  tipoSangre: string | null;
  estado: "normal" | "alerta" | "peligro";
  grupo: {
    id: number;
    nombre: string;
    color: GrupoColor;
  } | null;
  pulsera: {
    uuid: string;
    lastSeenAt: string | null;
  } | null;
  contactos: AlumnoContactoApiResponse[];
}

function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error API ${response.status} en ${path}`);
  }

  return response.json() as Promise<T>;
}

function formatDate(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function ageFromDate(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) {
    return undefined;
  }

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function initialsFromName(nombre: string, apellido: string): string {
  const first = nombre.trim().charAt(0);
  const second = apellido.trim().charAt(0);
  return `${first}${second}`.toUpperCase();
}

function formatLastSeen(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const seenAt = new Date(value);
  if (Number.isNaN(seenAt.getTime())) {
    return undefined;
  }

  const minutes = Math.max(1, Math.floor((Date.now() - seenAt.getTime()) / 60000));

  if (minutes < 60) {
    return `Hace ${minutes} minuto${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} hora${hours === 1 ? "" : "s"}`;
  }

  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days === 1 ? "" : "s"}`;
}

function mapGrupo(grupo: GrupoApiResponse): GrupoMock {
  return {
    id: String(grupo.id),
    nombre: grupo.nombre,
    color: grupo.color,
    totalAlumnos: grupo.totalAlumnos,
    iconText: "G",
    bubbles: Math.min(grupo.totalAlumnos, 6),
  };
}

function mapAlumno(alumno: AlumnoApiResponse): AlumnoMock {
  const contactoTutor = alumno.contactos.find((contacto) => contacto.tipo === "TUTOR");
  const contactosEmergencia = alumno.contactos
    .filter((contacto) => contacto.tipo === "EMERGENCIA")
    .map((contacto) => ({
      nombre: contacto.nombre,
      edad: ageFromDate(contacto.fechaNacimiento) ?? 0,
      fechaNacimiento: formatDate(contacto.fechaNacimiento) ?? "—",
      telefono: contacto.telefono,
    }));

  return {
    id: alumno.id,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    iniciales: initialsFromName(alumno.nombre, alumno.apellido),
    grupoId: alumno.grupo ? String(alumno.grupo.id) : "",
    estado: alumno.estado,
    nombreCompleto: `${alumno.nombre} ${alumno.apellido}`,
    edad: ageFromDate(alumno.fechaNacimiento),
    fechaNacimiento: formatDate(alumno.fechaNacimiento),
    tipoSangre: alumno.tipoSangre ?? undefined,
    direccion: contactoTutor?.direccion ?? undefined,
    nombrePadre: contactoTutor?.nombre ?? undefined,
    telefonoPadre: contactoTutor?.telefono ?? undefined,
    idDispositivo: alumno.pulsera?.uuid,
    ultimaConexion: formatLastSeen(alumno.pulsera?.lastSeenAt ?? null),
    contactosEmergencia,
  };
}

export async function getGrupos(): Promise<GrupoMock[]> {
  const grupos = await fetchApi<GrupoApiResponse[]>("/grupos");
  return grupos.map(mapGrupo);
}

export async function getGrupoById(grupoId: string): Promise<GrupoMock | undefined> {
  const grupos = await getGrupos();
  return grupos.find((grupo) => grupo.id === grupoId);
}

export async function getAlumnosByGrupo(grupoId: string): Promise<AlumnoMock[]> {
  const alumnos = await fetchApi<AlumnoApiResponse[]>(`/grupos/${grupoId}/alumnos`);
  return alumnos.map(mapAlumno);
}

export async function getAlumnoById(
  grupoId: string,
  alumnoId: string,
): Promise<AlumnoMock | undefined> {
  const alumnos = await getAlumnosByGrupo(grupoId);
  return alumnos.find((alumno) => alumno.id === alumnoId);
}
