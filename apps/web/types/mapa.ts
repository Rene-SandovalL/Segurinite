export interface Mapa {
  id: number;
  nombre: string;
  imagenUrl: string;
  createdAt: string;
}

export interface MapaConBeacons extends Mapa {
  beacons: BeaconEnMapa[];
}

export interface BeaconEnMapa {
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
