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
  { id: "1", nombre: "ALEJANDRO", apellido: "GONZALEZ", iniciales: "AG", grupoId: "4a", estado: "peligro" },
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

export const docentesPorGrupoMock: Record<string, DocenteGrupo> = {
  "4a": {
    id: "d-4a",
    grupoId: "4a",
    rol: "docente",
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
  },
};