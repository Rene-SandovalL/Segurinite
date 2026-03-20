import { Injectable } from '@nestjs/common';
import { pulseras_estado } from '../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface PulseraConectadaResponse {
  id: string;
  identificador: string;
  uuid: string;
  estado: pulseras_estado;
  conectada: boolean;
}

@Injectable()
export class PulserasService {
  constructor(private readonly prisma: PrismaService) {}

  async findConectadasDisponibles(): Promise<PulseraConectadaResponse[]> {
    const pulseras = await this.prisma.pulseras.findMany({
      where: {
        estado: pulseras_estado.CONECTADA,
        alumnos: null,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        uuid: true,
        mac_address: true,
        estado: true,
      },
    });

    return pulseras.map((pulsera) => ({
      id: pulsera.id.toString(),
      identificador: pulsera.mac_address ?? pulsera.uuid,
      uuid: pulsera.uuid,
      estado: pulsera.estado,
      conectada: pulsera.estado === pulseras_estado.CONECTADA,
    }));
  }
}
