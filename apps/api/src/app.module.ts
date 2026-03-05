import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';

@Module({
  imports: [AlumnosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
