export type ColorGrupo = "morado" | "naranja" | "verde" | "verde-oscuro";

export interface Grupo {
  id: string;
  nombre: string;       
  color: ColorGrupo;    
  totalAlumnos: number; 
}