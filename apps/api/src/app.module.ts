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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AlumnosModule,
    GruposModule,
    PulserasModule,
    ColoresModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
