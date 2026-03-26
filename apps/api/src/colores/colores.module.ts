import { Module } from '@nestjs/common';
import { ColoresController } from './colores.controller';
import { ColoresService } from './colores.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ColoresController],
  providers: [ColoresService],
  exports: [ColoresService],
})
export class ColoresModule {}
