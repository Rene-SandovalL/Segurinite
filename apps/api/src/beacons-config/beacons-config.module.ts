import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BeaconsModule } from '../beacons/beacons.module';
import { BeaconsConfigController } from './beacons-config.controller';
import { BeaconSerialService } from './beacons-config.service';

@Module({
  imports: [AuthModule, BeaconsModule],
  controllers: [BeaconsConfigController],
  providers: [BeaconSerialService],
})
export class BeaconsConfigModule {}
