import type { Alumno } from "@/types/alumno";

export interface AlumnoMock extends Alumno {
  grupoId: string;
}

export const ALUMNOS_MOCK: AlumnoMock[] = [
  // ── GRUPO 4-A (id: "1") ─────────────────────────────────────
  {
    id: "a01", nombre: "ALEJANDRO", apellido: "GONZALEZ",
    iniciales: "AG", grupoId: "1", estado: "peligro",
    nombreCompleto: "ALEJANDRO GONZALEZ",
    edad: 24, fechaNacimiento: "13/01/2005", tipoSangre: "A+",
    direccion: "Benito Juarez #202 Col. Centro.",
    nombrePadre: "Ramon Antonio Gonzalez", telefonoPadre: "6698585845",
    idDispositivo: "SEG-WB", ultimaConexion: "Hace 5 minutos",
    contactosEmergencia: [
      { nombre: "Hector Gonzalez", edad: 84, fechaNacimiento: "25/10/1925", telefono: "66916585454" },
    ],
    datosVitales: { presionSys: 118, presionDia: 78, pulso: 76, temperatura: 26.6, ultimaLectura: "Hace 5 min." },
  },
  {
    id: "a02", nombre: "RAYMUNDO", apellido: "MEDRANO",
    iniciales: "RM", grupoId: "1", estado: "normal",
    nombreCompleto: "RAYMUNDO MEDRANO",
    edad: 22, fechaNacimiento: "05/07/2002", tipoSangre: "O+",
    direccion: "Av. Reforma #410 Col. Centro.",
    nombrePadre: "Luis Medrano Ruiz", telefonoPadre: "6691234567",
    idDispositivo: "SEG-001", ultimaConexion: "Hace 2 minutos",
    contactosEmergencia: [
      { nombre: "Maria Medrano", edad: 50, fechaNacimiento: "12/03/1974", telefono: "6699876543" },
    ],
    datosVitales: { presionSys: 120, presionDia: 80, pulso: 72, temperatura: 36.5, ultimaLectura: "Hace 2 min." },
  },
  {
    id: "a03", nombre: "CARLOS", apellido: "MEZA",
    iniciales: "CM", grupoId: "1", estado: "normal",
    nombreCompleto: "CARLOS MEZA",
    edad: 21, fechaNacimiento: "18/11/2003", tipoSangre: "B+",
    direccion: "Calle Hidalgo #55 Col. Moderna.",
    nombrePadre: "Jorge Meza", telefonoPadre: "6694567890",
    idDispositivo: "SEG-002", ultimaConexion: "Hace 10 minutos",
    contactosEmergencia: [
      { nombre: "Ana Meza", edad: 45, fechaNacimiento: "20/06/1979", telefono: "6692345678" },
    ],
    datosVitales: { presionSys: 115, presionDia: 75, pulso: 68, temperatura: 36.8, ultimaLectura: "Hace 10 min." },
  },
  {
    id: "a04", nombre: "JOSE", apellido: "GUTIERREZ",
    iniciales: "JG", grupoId: "1", estado: "normal",
    nombreCompleto: "JOSE GUTIERREZ",
    edad: 23, fechaNacimiento: "22/04/2002", tipoSangre: "A-",
    direccion: "Blvd. Morelos #900 Col. Chapultepec.",
    nombrePadre: "Pedro Gutierrez", telefonoPadre: "6697654321",
    idDispositivo: "SEG-003", ultimaConexion: "Hace 1 minuto",
    contactosEmergencia: [
      { nombre: "Rosa Gutierrez", edad: 52, fechaNacimiento: "08/01/1972", telefono: "6693456789" },
    ],
    datosVitales: { presionSys: 122, presionDia: 82, pulso: 74, temperatura: 37.0, ultimaLectura: "Hace 1 min." },
  },
  {
    id: "a05", nombre: "JOSE", apellido: "RAMIREZ",
    iniciales: "JR", grupoId: "1", estado: "normal",
    nombreCompleto: "JOSE RAMIREZ",
    edad: 20, fechaNacimiento: "30/09/2005", tipoSangre: "O-",
    direccion: "Calle Juarez #12 Col. Centro.",
    nombrePadre: "Antonio Ramirez", telefonoPadre: "6695678901",
    idDispositivo: "SEG-004", ultimaConexion: "Hace 7 minutos",
    contactosEmergencia: [
      { nombre: "Carmen Ramirez", edad: 48, fechaNacimiento: "14/07/1976", telefono: "6691111222" },
    ],
    datosVitales: { presionSys: 118, presionDia: 76, pulso: 70, temperatura: 36.6, ultimaLectura: "Hace 7 min." },
  },
  {
    id: "a06", nombre: "VICTORIA", apellido: "MARTINEZ",
    iniciales: "VM", grupoId: "1", estado: "normal",
    nombreCompleto: "VICTORIA MARTINEZ",
    edad: 22, fechaNacimiento: "03/03/2003", tipoSangre: "AB+",
    direccion: "Privada Las Palmas #8 Col. Jardines.",
    nombrePadre: "Roberto Martinez", telefonoPadre: "6692222333",
    idDispositivo: "SEG-005", ultimaConexion: "Hace 3 minutos",
    contactosEmergencia: [
      { nombre: "Elena Martinez", edad: 46, fechaNacimiento: "11/11/1978", telefono: "6693333444" },
    ],
    datosVitales: { presionSys: 112, presionDia: 72, pulso: 65, temperatura: 36.4, ultimaLectura: "Hace 3 min." },
  },
  {
    id: "a07", nombre: "ANGIE", apellido: "MUNGIA",
    iniciales: "AM", grupoId: "1", estado: "normal",
    nombreCompleto: "ANGIE MUNGIA",
    edad: 21, fechaNacimiento: "17/08/2004", tipoSangre: "B-",
    direccion: "Calle Allende #200 Col. Centro.",
    nombrePadre: "Luis Mungia", telefonoPadre: "6694444555",
    idDispositivo: "SEG-006", ultimaConexion: "Hace 15 minutos",
    contactosEmergencia: [
      { nombre: "Sara Mungia", edad: 44, fechaNacimiento: "25/02/1980", telefono: "6695555666" },
    ],
    datosVitales: { presionSys: 110, presionDia: 70, pulso: 64, temperatura: 36.7, ultimaLectura: "Hace 15 min." },
  },
  {
    id: "a08", nombre: "GUSTAVO", apellido: "HERNANDEZ",
    iniciales: "GH", grupoId: "1", estado: "normal",
    nombreCompleto: "GUSTAVO HERNANDEZ",
    edad: 23, fechaNacimiento: "09/12/2001", tipoSangre: "A+",
    direccion: "Av. Universidad #305 Col. Universitaria.",
    nombrePadre: "Miguel Hernandez", telefonoPadre: "6696666777",
    idDispositivo: "SEG-007", ultimaConexion: "Hace 4 minutos",
    contactosEmergencia: [
      { nombre: "Patricia Hernandez", edad: 50, fechaNacimiento: "02/05/1974", telefono: "6697777888" },
    ],
    datosVitales: { presionSys: 125, presionDia: 83, pulso: 78, temperatura: 36.9, ultimaLectura: "Hace 4 min." },
  },
  {
    id: "a09", nombre: "PEDRO", apellido: "LOAIZA",
    iniciales: "PL", grupoId: "1", estado: "normal",
    nombreCompleto: "PEDRO LOAIZA",
    edad: 22, fechaNacimiento: "28/06/2003", tipoSangre: "O+",
    direccion: "Calle 5 de Mayo #88 Col. Centro.",
    nombrePadre: "Carlos Loaiza", telefonoPadre: "6698888999",
    idDispositivo: "SEG-008", ultimaConexion: "Hace 6 minutos",
    contactosEmergencia: [
      { nombre: "Lucia Loaiza", edad: 47, fechaNacimiento: "19/09/1977", telefono: "6699999000" },
    ],
    datosVitales: { presionSys: 116, presionDia: 74, pulso: 69, temperatura: 36.5, ultimaLectura: "Hace 6 min." },
  },
  {
    id: "a10", nombre: "FERNANDO", apellido: "ORTEGA",
    iniciales: "FO", grupoId: "1", estado: "normal",
    nombreCompleto: "FERNANDO ORTEGA",
    edad: 24, fechaNacimiento: "14/02/2001", tipoSangre: "AB-",
    direccion: "Privada Roble #14 Fracc. Los Pinos.",
    nombrePadre: "Eduardo Ortega", telefonoPadre: "6690000111",
    idDispositivo: "SEG-009", ultimaConexion: "Hace 8 minutos",
    contactosEmergencia: [
      { nombre: "Gloria Ortega", edad: 51, fechaNacimiento: "07/03/1973", telefono: "6691112223" },
    ],
    datosVitales: { presionSys: 119, presionDia: 77, pulso: 71, temperatura: 36.6, ultimaLectura: "Hace 8 min." },
  },
  {
    id: "a11", nombre: "SANTIAGO", apellido: "QUINTERO",
    iniciales: "SQ", grupoId: "1", estado: "normal",
    nombreCompleto: "SANTIAGO QUINTERO",
    edad: 20, fechaNacimiento: "01/01/2006", tipoSangre: "A+",
    direccion: "Calle Independencia #303 Col. Norte.",
    nombrePadre: "Raul Quintero", telefonoPadre: "6692223334",
    idDispositivo: "SEG-010", ultimaConexion: "Hace 11 minutos",
    contactosEmergencia: [
      { nombre: "Isabel Quintero", edad: 43, fechaNacimiento: "30/10/1981", telefono: "6693334445" },
    ],
    datosVitales: { presionSys: 113, presionDia: 71, pulso: 66, temperatura: 36.3, ultimaLectura: "Hace 11 min." },
  },
  {
    id: "a12", nombre: "TRISTAN", apellido: "VAZQUES",
    iniciales: "TV", grupoId: "1", estado: "normal",
    nombreCompleto: "TRISTAN VAZQUES",
    edad: 21, fechaNacimiento: "23/07/2004", tipoSangre: "B+",
    direccion: "Av. Constitución #1010 Col. Sur.",
    nombrePadre: "Fernando Vazques", telefonoPadre: "6694445556",
    idDispositivo: "SEG-011", ultimaConexion: "Hace 9 minutos",
    contactosEmergencia: [
      { nombre: "Norma Vazques", edad: 49, fechaNacimiento: "16/04/1975", telefono: "6695556667" },
    ],
    datosVitales: { presionSys: 117, presionDia: 75, pulso: 67, temperatura: 36.7, ultimaLectura: "Hace 9 min." },
  },

  // ── GRUPO 2-B (id: "2") ─────────────────────────────────────
  {
    id: "b01", nombre: "LUCIANA", apellido: "TORRES",
    iniciales: "LT", grupoId: "2", estado: "normal",
    nombreCompleto: "LUCIANA TORRES",
  },
  {
    id: "b02", nombre: "MIGUEL", apellido: "FLORES",
    iniciales: "MF", grupoId: "2", estado: "alerta",
    nombreCompleto: "MIGUEL FLORES",
  },
  {
    id: "b03", nombre: "DANIELA", apellido: "RIOS",
    iniciales: "DR", grupoId: "2", estado: "normal",
    nombreCompleto: "DANIELA RIOS",
  },
  {
    id: "b04", nombre: "ROBERTO", apellido: "SOLIS",
    iniciales: "RS", grupoId: "2", estado: "normal",
    nombreCompleto: "ROBERTO SOLIS",
  },

  // ── GRUPO 1-A (id: "3") ─────────────────────────────────────
  {
    id: "c01", nombre: "EMILIO", apellido: "LUNA",
    iniciales: "EL", grupoId: "3", estado: "normal",
    nombreCompleto: "EMILIO LUNA",
  },
  {
    id: "c02", nombre: "VALERIA", apellido: "CAMPOS",
    iniciales: "VC", grupoId: "3", estado: "alerta",
    nombreCompleto: "VALERIA CAMPOS",
  },

  // ── GRUPO 1-B (id: "4") ─────────────────────────────────────
  {
    id: "d01", nombre: "MARCOS", apellido: "IBARRA",
    iniciales: "MI", grupoId: "4", estado: "normal",
    nombreCompleto: "MARCOS IBARRA",
  },
  {
    id: "d02", nombre: "ELENA", apellido: "VEGA",
    iniciales: "EV", grupoId: "4", estado: "normal",
    nombreCompleto: "ELENA VEGA",
  },
];

/** Filtra alumnos por grupoId */
export function getAlumnosByGrupo(grupoId: string): AlumnoMock[] {
  return ALUMNOS_MOCK.filter((a) => a.grupoId === grupoId);
}
