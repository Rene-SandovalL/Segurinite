import type { AlumnoMock } from "@/lib/mock/alumnos";
import type { BeaconMock } from "@/lib/mock/beacons";
import {
  resolverColorHex,
  type GrupoColor,
  type GrupoMock,
} from "@/lib/mock/grupos";
import type { MapaConBeaconsMock, MapaMock } from "@/lib/mock/mapas";
import type { PulseraMock } from "@/lib/mock/pulseras";
import type { ZonaMock } from "@/lib/mock/zonas";
import type { EstadoPulsera } from "@/types/pulsera";
import type { TipoZona } from "@/types/zona";
import type { DocenteGrupo } from "@/types/usuario";
import { apiFetch, ApiHttpError } from "./client";

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
  fotoUrl: string | null;
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
    ultimoBeaconId: number | null;
    ultimoBpm: number | null;
    ultimoSpo2: number | null;
    ultimaTemp: number | null;
  } | null;
  contactos: AlumnoContactoApiResponse[];
}

interface AlumnoMapaApiResponse {
  alumnoId: string;
  nombre: string;
  estado: "normal" | "alerta" | "peligro";
  ultimoBeaconId: number | null;
  ultimoBpm: number | null;
  ultimoSpo2: number | null;
  ultimaTemp: number | null;
}

export interface AlumnoMapaMock {
  alumnoId: string;
  nombre: string;
  estado: "normal" | "alerta" | "peligro";
  ultimoBeaconId: number | null;
  ultimoBpm: number | null;
  ultimoSpo2: number | null;
  ultimaTemp: number | null;
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

export interface UpdateAlumnoPayload {
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  tipoSangre?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
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

interface ZonaApiResponse {
  id: number;
  nombre: string;
  tipo: TipoZona;
  grupo: { id: number; nombre: string } | null;
}

interface MapaApiResponse {
  id: number;
  nombre: string;
  imagenUrl: string;
  createdAt: string;
}

interface BeaconApiResponse {
  id: number;
  beaconId: number;
  zonaId: number;
  mapaId: number | null;
  macAddress: string | null;
  nombre: string | null;
  posX: number | null;
  posY: number | null;
  activo: boolean;
  color: { id: number; nombre: string | null; valorHex: string } | null;
}

interface MapaConBeaconsApiResponse extends MapaApiResponse {
  beacons: BeaconApiResponse[];
}

export interface CrearMapaPayload {
  nombre: string;
  archivo: File;
}

export interface ActualizarPosicionBeaconPayload {
  posX: number;
  posY: number;
  mapaId?: number;
}

interface PulseraFullApiResponse {
  id: string;
  uuid: string;
  alias: string | null;
  estado: EstadoPulsera;
  macAddress: string | null;
  bateria: number | null;
  lastSeenAt: string | null;
}

export interface PuertoSerial {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  vendorId?: string;
  productId?: string;
}

export interface ConectarPuertoResponse {
  connected: boolean;
  path: string;
}

export interface LecturaIdBeacon {
  id: number | null;
  raw: string;
}

export interface ComandoSerialResponse {
  ok: boolean;
  raw: string;
}

export interface ConfigSerialPulsera {
  ssid: string;
  broker: string;
  port?: number;
  mac: string;
}

export interface RegistrarBeaconPayload {
  beaconId: number;
  zonaId: number;
  macAddress?: string;
  nombre?: string;
  colorId?: number;
  mapaId?: number;
}

export interface ActualizarBeaconConfigPayload {
  nombre?: string;
  colorId?: number;
  zonaId?: number;
  mapaId?: number;
}

export interface RegistrarPulseraPayload {
  macAddress: string;
  alias?: string;
}

export interface ActualizarPulseraConfigPayload {
  alias?: string;
  estado?: EstadoPulsera;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(path, init);
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
      fechaNacimientoIso: contacto.fechaNacimiento ?? undefined,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco ?? undefined,
      direccion: contacto.direccion ?? undefined,
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
    fotoUrl: alumno.fotoUrl ?? undefined,
    nombreCompleto: `${alumno.nombre} ${alumno.apellido}`,
    edad: ageFromDate(alumno.fechaNacimiento),
    fechaNacimiento: formatDate(alumno.fechaNacimiento),
    fechaNacimientoIso: alumno.fechaNacimiento ?? undefined,
    tipoSangre: alumno.tipoSangre ?? undefined,
    direccion: direccionesTutor[0],
    nombrePadre: contactoTutor?.nombre ?? undefined,
    telefonoPadre: contactoTutor?.telefono ?? undefined,
    tutores,
    idDispositivo: alumno.pulsera?.uuid,
    ultimaConexion: formatLastSeen(alumno.pulsera?.lastSeenAt ?? null),
    contactosEmergencia,
    datosVitales: alumno.pulsera
      ? {
          spo2: alumno.pulsera.ultimoSpo2,
          pulso: alumno.pulsera.ultimoBpm,
          temperatura: alumno.pulsera.ultimaTemp,
          ultimaLectura: formatLastSeen(alumno.pulsera.lastSeenAt) ?? null,
        }
      : undefined,
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

export async function getAlumnosMapa(grupoId: string): Promise<AlumnoMapaMock[]> {
  return fetchApi<AlumnoMapaApiResponse[]>(`/grupos/${grupoId}/alumnos-mapa`);
}

interface DocenteApiResponse {
  id: number;
  nombre: string;
  fechaNacimiento: string | null;
  rfc: string | null;
  telefono: string | null;
  correo: string | null;
  observaciones: string | null;
  fotoUrl: string | null;
  grupoId: number | null;
}

function mapDocente(docente: DocenteApiResponse): DocenteGrupo {
  return {
    id: docente.id,
    nombre: docente.nombre,
    fechaNacimiento: formatDate(docente.fechaNacimiento) ?? null,
    rfc: docente.rfc,
    telefono: docente.telefono,
    correo: docente.correo,
    observaciones: docente.observaciones,
    fotoUrl: docente.fotoUrl,
    grupoId: docente.grupoId,
  };
}

export async function getDocenteByGrupo(grupoId: string): Promise<DocenteGrupo | undefined> {
  const docente = await fetchApi<DocenteApiResponse | null>(`/grupos/${grupoId}/docente`);
  return docente ? mapDocente(docente) : undefined;
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

export async function actualizarAlumno(
  alumnoId: string,
  payload: UpdateAlumnoPayload,
): Promise<AlumnoMock> {
  const alumno = await fetchApi<AlumnoApiResponse>(`/alumnos/${alumnoId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapAlumno(alumno);
}

export async function quitarAlumnoDeGrupo(alumnoId: string): Promise<AlumnoMock> {
  const alumno = await fetchApi<AlumnoApiResponse>(`/alumnos/${alumnoId}/grupo`, {
    method: "PATCH",
    body: JSON.stringify({ grupoId: null }),
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

function mapZona(zona: ZonaApiResponse): ZonaMock {
  return {
    id: zona.id,
    nombre: zona.nombre,
    tipo: zona.tipo,
    grupo: zona.grupo,
  };
}

function mapMapa(mapa: MapaApiResponse): MapaMock {
  return {
    id: mapa.id,
    nombre: mapa.nombre,
    imagenUrl: mapa.imagenUrl,
    createdAt: mapa.createdAt,
  };
}

function mapBeacon(beacon: BeaconApiResponse): BeaconMock {
  return {
    id: beacon.id,
    beaconId: beacon.beaconId,
    zonaId: beacon.zonaId,
    mapaId: beacon.mapaId,
    macAddress: beacon.macAddress,
    nombre: beacon.nombre,
    posX: beacon.posX,
    posY: beacon.posY,
    activo: beacon.activo,
    color: beacon.color,
  };
}

export async function getZonas(): Promise<ZonaMock[]> {
  const zonas = await fetchApi<ZonaApiResponse[]>("/zonas");
  return zonas.map(mapZona);
}

export async function getMapas(): Promise<MapaMock[]> {
  const mapas = await fetchApi<MapaApiResponse[]>("/mapas");
  return mapas.map(mapMapa);
}

export async function getMapaById(
  mapaId: number,
): Promise<MapaConBeaconsMock | undefined> {
  try {
    const mapa = await fetchApi<MapaConBeaconsApiResponse>(`/mapas/${mapaId}`);
    return {
      ...mapMapa(mapa),
      beacons: mapa.beacons.map(mapBeacon),
    };
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) {
      return undefined;
    }

    throw error;
  }
}

export async function crearMapa(payload: CrearMapaPayload): Promise<MapaMock> {
  const formData = new FormData();
  formData.append("nombre", payload.nombre);
  formData.append("archivo", payload.archivo);

  const mapa = await fetchApi<MapaApiResponse>("/mapas", {
    method: "POST",
    body: formData,
  });

  return mapMapa(mapa);
}

export async function getBeacons(): Promise<BeaconMock[]> {
  const beacons = await fetchApi<BeaconApiResponse[]>("/beacons");
  return beacons.map(mapBeacon);
}

export async function getBeaconsSinPosicion(): Promise<BeaconMock[]> {
  const beacons = await fetchApi<BeaconApiResponse[]>("/beacons/sin-posicion");
  return beacons.map(mapBeacon);
}

export async function actualizarPosicionBeacon(
  beaconId: number,
  payload: ActualizarPosicionBeaconPayload,
): Promise<BeaconMock> {
  const beacon = await fetchApi<BeaconApiResponse>(`/beacons/${beaconId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapBeacon(beacon);
}

function mapPulsera(pulsera: PulseraFullApiResponse): PulseraMock {
  return {
    id: pulsera.id,
    uuid: pulsera.uuid,
    alias: pulsera.alias,
    estado: pulsera.estado,
    macAddress: pulsera.macAddress,
    bateria: pulsera.bateria,
    lastSeenAt: pulsera.lastSeenAt,
  };
}

export async function getPulseras(): Promise<PulseraMock[]> {
  const pulseras = await fetchApi<PulseraFullApiResponse[]>("/pulseras");
  return pulseras.map(mapPulsera);
}

export async function getPulserasDisponibles(): Promise<PulseraMock[]> {
  const pulseras = await fetchApi<PulseraFullApiResponse[]>("/pulseras/disponibles");
  return pulseras.map(mapPulsera);
}

export async function registrarBeacon(
  payload: RegistrarBeaconPayload,
): Promise<BeaconMock> {
  const beacon = await fetchApi<BeaconApiResponse>("/beacons-config/registrar", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapBeacon(beacon);
}

export async function actualizarBeaconConfig(
  beaconId: number,
  payload: ActualizarBeaconConfigPayload,
): Promise<BeaconMock> {
  const beacon = await fetchApi<BeaconApiResponse>(`/beacons-config/${beaconId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapBeacon(beacon);
}

export async function registrarPulsera(
  payload: RegistrarPulseraPayload,
): Promise<PulseraMock> {
  const pulsera = await fetchApi<PulseraFullApiResponse>("/pulseras-config/registrar", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapPulsera(pulsera);
}

export async function actualizarPulseraConfig(
  pulseraId: string,
  payload: ActualizarPulseraConfigPayload,
): Promise<PulseraMock> {
  const pulsera = await fetchApi<PulseraFullApiResponse>(
    `/pulseras-config/${pulseraId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return mapPulsera(pulsera);
}

export async function listarPuertosBeacon(): Promise<PuertoSerial[]> {
  return fetchApi<PuertoSerial[]>("/beacons-config/ports");
}

export async function conectarPuertoBeacon(
  path: string,
): Promise<ConectarPuertoResponse> {
  return fetchApi<ConectarPuertoResponse>("/beacons-config/connect", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function desconectarPuertoBeacon(): Promise<{ connected: boolean }> {
  return fetchApi<{ connected: boolean }>("/beacons-config/disconnect", {
    method: "POST",
  });
}

export async function leerIdBeacon(): Promise<LecturaIdBeacon> {
  return fetchApi<LecturaIdBeacon>("/beacons-config/id");
}

export async function asignarIdBeacon(id: number): Promise<ComandoSerialResponse> {
  return fetchApi<ComandoSerialResponse>("/beacons-config/id", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

export async function listarPuertosPulsera(): Promise<PuertoSerial[]> {
  return fetchApi<PuertoSerial[]>("/pulseras-config/ports");
}

export async function conectarPuertoPulsera(
  path: string,
): Promise<ConectarPuertoResponse> {
  return fetchApi<ConectarPuertoResponse>("/pulseras-config/connect", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function desconectarPuertoPulsera(): Promise<{ connected: boolean }> {
  return fetchApi<{ connected: boolean }>("/pulseras-config/disconnect", {
    method: "POST",
  });
}

export async function leerConfigPulsera(): Promise<ConfigSerialPulsera> {
  return fetchApi<ConfigSerialPulsera>("/pulseras-config/config");
}

export async function configurarWifiPulsera(
  ssid: string,
  password: string,
): Promise<ComandoSerialResponse> {
  return fetchApi<ComandoSerialResponse>("/pulseras-config/wifi", {
    method: "POST",
    body: JSON.stringify({ ssid, password }),
  });
}

export async function configurarMqttPulsera(
  broker: string,
  port: number,
): Promise<ComandoSerialResponse> {
  return fetchApi<ComandoSerialResponse>("/pulseras-config/mqtt", {
    method: "POST",
    body: JSON.stringify({ broker, port }),
  });
}
