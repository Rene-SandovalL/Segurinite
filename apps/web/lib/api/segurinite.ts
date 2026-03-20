import type { AlumnoMock } from "@/lib/mock/alumnos";
import {
  resolverColorHex,
  type GrupoColor,
  type GrupoMock,
} from "@/lib/mock/grupos";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiHttpError";
  }
}

interface GrupoColorApiResponse {
  id: number;
  nombre: string | null;
  valorHex: string;
}

interface GrupoApiResponse {
  id: number;
  nombre: string;
  color: GrupoColorApiResponse;
  totalAlumnos: number;
}

interface PulseraApiResponse {
  id: string;
  identificador: string;
  uuid: string;
  estado: "DISPONIBLE" | "CONECTADA" | "REGISTRADA" | "ASIGNADA";
  conectada: boolean;
}

interface ColorApiResponse {
  id: number;
  nombre: string | null;
  valorHex: string;
  ocupado: boolean;
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
    colorId: number;
    colorNombre: string | null;
    colorHex: string;
  } | null;
  pulsera: {
    id: string;
    uuid: string;
    estado: "DISPONIBLE" | "CONECTADA" | "REGISTRADA" | "ASIGNADA";
    lastSeenAt: string | null;
  } | null;
  contactos: AlumnoContactoApiResponse[];
}

interface TutorCreateAlumnoPayload {
  nombre: string;
  telefono: string;
  parentesco?: string;
  direccion?: string;
}

interface ContactoEmergenciaCreateAlumnoPayload {
  nombre: string;
  telefono: string;
  fechaNacimiento?: string;
  parentesco?: string;
  direccion?: string;
}

export interface CreateAlumnoPayload {
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  tipoSangre?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  pulseraId: string;
  tutores?: TutorCreateAlumnoPayload[];
  contactosEmergencia?: ContactoEmergenciaCreateAlumnoPayload[];
}

export interface ColorGrupoDisponible {
  id: number;
  nombre: string | null;
  valorHex: string;
  ocupado: boolean;
}

export interface CreateColorPayload {
  nombre?: string;
  valorHex: string;
}

export interface CreateGrupoPayload {
  nombre: string;
  colorId: number;
}

export interface PulseraConectada {
  id: string;
  identificador: string;
  uuid: string;
  estado: "DISPONIBLE" | "CONECTADA" | "REGISTRADA" | "ASIGNADA";
  conectada: boolean;
}

function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let detalle = `Error API ${response.status} en ${path}`;

    try {
      const errorBody = (await response.json()) as
        | { message?: string | string[] }
        | undefined;

      if (Array.isArray(errorBody?.message)) {
        detalle = errorBody.message.join(", ");
      } else if (typeof errorBody?.message === "string" && errorBody.message.trim()) {
        detalle = errorBody.message;
      }
    } catch {
      // sin body JSON
    }

    throw new ApiHttpError(detalle, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
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
    color: resolverColorHex(grupo.color.valorHex) as GrupoColor,
    totalAlumnos: grupo.totalAlumnos,
    iconText: "G",
    bubbles: Math.min(grupo.totalAlumnos, 6),
  };
}

function mapAlumno(alumno: AlumnoApiResponse): AlumnoMock {
  const tutores = alumno.contactos
    .filter((contacto) => contacto.tipo === "TUTOR")
    .slice(0, 2)
    .map((contacto) => {
      const parentesco = contacto.parentesco?.trim();
      const direccion = contacto.direccion?.trim();

      return {
        nombre: contacto.nombre,
        telefono: contacto.telefono,
        parentesco: parentesco ? parentesco : undefined,
        direccion: direccion ? direccion : undefined,
      };
    });

  const contactoTutor = tutores[0];
  const direccionesTutor = Array.from(
    new Set(
      tutores
        .map((tutor) => tutor.direccion?.trim())
        .filter((direccion): direccion is string => Boolean(direccion)),
    ),
  );

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
    grupoColor: alumno.grupo
      ? resolverColorHex(alumno.grupo.colorHex)
      : undefined,
    estado: alumno.estado,
    nombreCompleto: `${alumno.nombre} ${alumno.apellido}`,
    edad: ageFromDate(alumno.fechaNacimiento),
    fechaNacimiento: formatDate(alumno.fechaNacimiento),
    tipoSangre: alumno.tipoSangre ?? undefined,
    direccion: direccionesTutor[0],
    nombrePadre: contactoTutor?.nombre ?? undefined,
    telefonoPadre: contactoTutor?.telefono ?? undefined,
    tutores,
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
  try {
    const grupo = await fetchApi<GrupoApiResponse>(`/grupos/${grupoId}`);
    return mapGrupo(grupo);
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) {
      return undefined;
    }

    throw error;
  }
}

export async function getAlumnos(): Promise<AlumnoMock[]> {
  const alumnos = await fetchApi<AlumnoApiResponse[]>("/alumnos");
  return alumnos.map(mapAlumno);
}

export async function getAlumnosByGrupo(grupoId: string): Promise<AlumnoMock[]> {
  const alumnos = await fetchApi<AlumnoApiResponse[]>(`/grupos/${grupoId}/alumnos`);
  return alumnos.map(mapAlumno);
}

export async function asignarAlumnoAGrupo(
  grupoId: string,
  alumnoId: string,
): Promise<AlumnoMock> {
  const alumno = await fetchApi<AlumnoApiResponse>(
    `/alumnos/${alumnoId}/grupo/${grupoId}`,
    {
      method: "PATCH",
    },
  );

  return mapAlumno(alumno);
}

export async function getAlumnoById(
  grupoId: string,
  alumnoId: string,
): Promise<AlumnoMock | undefined> {
  const alumnos = await getAlumnosByGrupo(grupoId);
  return alumnos.find((alumno) => alumno.id === alumnoId);
}

export async function getPulserasConectadas(): Promise<PulseraConectada[]> {
  const pulseras = await fetchApi<PulseraApiResponse[]>("/pulseras/conectadas");
  return pulseras.map((pulsera) => ({
    id: pulsera.id,
    identificador: pulsera.identificador,
    uuid: pulsera.uuid,
    estado: pulsera.estado,
    conectada: pulsera.conectada,
  }));
}

export async function crearAlumno(payload: CreateAlumnoPayload): Promise<AlumnoMock> {
  const alumno = await fetchApi<AlumnoApiResponse>("/alumnos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapAlumno(alumno);
}

export async function getColores(): Promise<ColorGrupoDisponible[]> {
  const colores = await fetchApi<ColorApiResponse[]>("/colores");
  return colores.map((color) => ({
    id: color.id,
    nombre: color.nombre,
    valorHex: resolverColorHex(color.valorHex),
    ocupado: color.ocupado,
  }));
}

export async function crearColor(payload: CreateColorPayload): Promise<ColorGrupoDisponible> {
  const color = await fetchApi<ColorApiResponse>("/colores", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: color.id,
    nombre: color.nombre,
    valorHex: resolverColorHex(color.valorHex),
    ocupado: color.ocupado,
  };
}

export async function crearGrupo(payload: CreateGrupoPayload): Promise<GrupoMock> {
  const grupo = await fetchApi<GrupoApiResponse>("/grupos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapGrupo(grupo);
}
