export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  rol: "docente" | "admin";
}

export interface DocenteGrupo extends Usuario {
  grupoId: string;
  iniciales: string;
  nombreCompleto: string;
  nombrePlataforma: string;
  gatewayEstado: string;
  fechaNacimiento: string;
  correo: string;
  telefono: string;
  observaciones: string;
}
