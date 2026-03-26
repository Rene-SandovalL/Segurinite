import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AlumnosController],
  providers: [AlumnosService],
  exports: [AlumnosService],
})
export class AlumnosModule {}
