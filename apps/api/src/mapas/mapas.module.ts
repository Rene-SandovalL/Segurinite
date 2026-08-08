import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { MapasController } from './mapas.controller';
import { MapasService } from './mapas.service';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [MapasController],
  providers: [MapasService],
  exports: [MapasService],
})
export class MapasModule {}
