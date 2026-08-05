import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';

function createTimescaleAdapter(): PrismaPg {
  const databaseUrl = process.env.TIMESCALE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('TIMESCALE_DATABASE_URL no está configurada para Prisma');
  }

  return new PrismaPg(new Pool({ connectionString: databaseUrl }));
}

// Misma clase de cliente generada que PrismaService, pero apuntando a la base de
// TimescaleDB. Los modelos del schema (alumnos, grupos, ...) no existen ahí — este
// cliente es solo para $executeRaw/$queryRaw contra la hypertable `telemetria`.
@Injectable()
export class TimescaleService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: createTimescaleAdapter(),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
