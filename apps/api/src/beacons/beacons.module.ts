import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BeaconsController } from './beacons.controller';
import { BeaconsService } from './beacons.service';

@Module({
  imports: [AuthModule],
  controllers: [BeaconsController],
  providers: [BeaconsService],
  exports: [BeaconsService],
})
export class BeaconsModule {}
