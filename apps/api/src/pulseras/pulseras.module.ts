import { Module } from '@nestjs/common';
import { PulserasController } from './pulseras.controller';
import { PulserasService } from './pulseras.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PulserasController],
  providers: [PulserasService],
  exports: [PulserasService],
})
export class PulserasModule {}
