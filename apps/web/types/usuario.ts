export interface DocenteGrupo {
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
