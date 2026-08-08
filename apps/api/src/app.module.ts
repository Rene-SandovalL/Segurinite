import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';
import { GruposModule } from './grupos/grupos.module';
import { PulserasModule } from './pulseras/pulseras.module';
import { ColoresModule } from './colores/colores.module';
import { AuthModule } from './auth/auth.module';
import { TelemetriaModule } from './telemetria/telemetria.module';
import { ZonasModule } from './zonas/zonas.module';
import { MapasModule } from './mapas/mapas.module';
import { BeaconsModule } from './beacons/beacons.module';
import { BeaconsConfigModule } from './beacons-config/beacons-config.module';
import { PulserasConfigModule } from './pulseras-config/pulseras-config.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DocentesModule } from './docentes/docentes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AlumnosModule,
    GruposModule,
    PulserasModule,
    ColoresModule,
    AuthModule,
    TelemetriaModule,
    ZonasModule,
    MapasModule,
    BeaconsModule,
    BeaconsConfigModule,
    PulserasConfigModule,
    UsuariosModule,
    DocentesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
