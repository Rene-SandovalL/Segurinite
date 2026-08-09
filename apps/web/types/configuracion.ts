export interface ConfiguracionHorario {
  horaEntrada: string;
  horaSalida: string;
  toleranciaTardanzaMinutos: number;
  updatedAt: string;
}

export interface ConfiguracionAlertas {
  tempAlertaMin: number;
  tempNormalMin: number;
  tempNormalMax: number;
  tempAlertaMax: number;
  bpmAlto: number;
  contadorTemp: number;
  contadorVitalCero: number;
  contadorFueraZona: number;
  sinSenalSegundos: number;
  updatedAt: string;
}
