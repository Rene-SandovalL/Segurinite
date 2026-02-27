import { type Grupo } from "../types/grupo";
import { type Alumno } from "../types/alumno";
import { type DocenteGrupo } from "../types/usuario";

/** Grupos de prueba — reemplazar por llamada a la API cuando esté lista */
export const gruposMock: Grupo[] = [
  { id: "4a", nombre: "GRUPO 4-A", color: "morado", totalAlumnos: 12 },
  { id: "2b", nombre: "GRUPO 2-B", color: "naranja", totalAlumnos: 10 },
  { id: "1a", nombre: "GRUPO 1-A", color: "verde", totalAlumnos: 8 },
  { id: "1b", nombre: "GRUPO 1-B", color: "verde-oscuro", totalAlumnos: 9 },
];

/** Alumnos de prueba del Grupo 4-A — reemplazar por llamada a la API */
export const alumnosMock: Alumno[] = [
  {
    id: "1",
    nombre: "ALEJANDRO",
    apellido: "GONZALEZ",
    iniciales: "AG",
    grupoId: "4a",
    estado: "peligro",
    nombreCompleto: "Alejandro Gonzalez Escalera",
    edad: 24,
    fechaNacimiento: "13/01/2005",
    tipoSangre: "A+",
    direccion: "Benito Juarez #202 Col. Centro.",
    nombrePadre: "Ramon Antonio Gonzalez",
    telefonoPadre: "6698585845",
    fotoUrl: "/alumnos/alejandro.jpg",
    idDispositivo: "SEG-WB",
    ultimaConexion: "Hace 5 minutos",
    contactosEmergencia: [
      {
        nombre: "Hector Gonzalez",
        edad: 84,
        fechaNacimiento: "25/10/1925",
        telefono: "66916585454",
      },
    ],
    datosVitales: {
      presionSys: 118,
      presionDia: 78,
      pulso: 76,
      temperatura: 26.6,
      ultimaLectura: "Hace 5 min.",
    },
  },
  { id: "2", nombre: "RAYMUNDO", apellido: "MEDRANO", iniciales: "RM", grupoId: "4a", estado: "normal" },
  { id: "3", nombre: "CARLOS", apellido: "MEZA", iniciales: "CM", grupoId: "4a", estado: "normal" },
  { id: "4", nombre: "JOSE", apellido: "GUTIERREZ", iniciales: "JG", grupoId: "4a", estado: "normal" },
  { id: "5", nombre: "JOSE", apellido: "RAMIREZ", iniciales: "JR", grupoId: "4a", estado: "normal" },
  { id: "6", nombre: "VICTORIA", apellido: "MARTINEZ", iniciales: "VM", grupoId: "4a", estado: "normal" },
  { id: "7", nombre: "ANGIE", apellido: "MUNGIA", iniciales: "AM", grupoId: "4a", estado: "normal" },
  { id: "8", nombre: "GUSTAVO", apellido: "HERNANDEZ", iniciales: "GH", grupoId: "4a", estado: "normal" },
  { id: "9", nombre: "PEDRO", apellido: "LOAIZA", iniciales: "PL", grupoId: "4a", estado: "normal" },
  { id: "10", nombre: "FERNANDO", apellido: "ORTEGA", iniciales: "FO", grupoId: "4a", estado: "normal" },
  { id: "11", nombre: "SANTIAGO", apellido: "QUINTERO", iniciales: "SQ", grupoId: "4a", estado: "normal" },
  { id: "12", nombre: "TRISTAN", apellido: "VAZQUES", iniciales: "TV", grupoId: "4a", estado: "normal" },
];

/** Datos base del docente — se reutilizan para todos los grupos */
const docenteBase = {
  rol: "docente" as const,
  nombre: "RAYMUNDO",
  apellido: "MEDRANO",
  nombreCompleto: "Raymundo Medrano",
  iniciales: "RM",
  nombrePlataforma: "Rayblox Gamer",
  gatewayEstado: "Activo",
  fechaNacimiento: "12/07/1986",
  correo: "raymundo.medrano@segurinite.edu.mx",
  telefono: "+52 614 221 8890",
  observaciones: "Sin incidencias",
};

export const docentesPorGrupoMock: Record<string, DocenteGrupo> = {
  "4a": { ...docenteBase, id: "d-4a", grupoId: "4a" },
  "2b": { ...docenteBase, id: "d-2b", grupoId: "2b" },
  "1a": { ...docenteBase, id: "d-1a", grupoId: "1a" },
  "1b": { ...docenteBase, id: "d-1b", grupoId: "1b" },
};