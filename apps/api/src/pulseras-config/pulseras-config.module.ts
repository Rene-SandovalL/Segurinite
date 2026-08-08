import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PulserasModule } from '../pulseras/pulseras.module';
import { PulserasConfigController } from './pulseras-config.controller';
import { PulseraSerialService } from './pulseras-config.service';

@Module({
  imports: [AuthModule, PulserasModule],
  controllers: [PulserasConfigController],
  providers: [PulseraSerialService],
})
export class PulserasConfigModule {}
