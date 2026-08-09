import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfiguracionCacheService } from './configuracion-cache.service';
import { ConfiguracionController } from './configuracion.controller';
import { ConfiguracionService } from './configuracion.service';

@Module({
  imports: [AuthModule],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService, ConfiguracionCacheService],
  exports: [ConfiguracionCacheService],
})
export class ConfiguracionModule {}
