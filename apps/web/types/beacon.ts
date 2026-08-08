export interface Beacon {
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
