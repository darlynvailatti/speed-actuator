import { Module } from '@nestjs/common';
import { DetectionController } from './detection.controller';
import { DetectionPublisherService } from './detection-publisher.service';
import { DatabaseModule } from '../database/database.module';
import { DetectionListenerService } from './detection-listener.service';
import { StateUpdaterModule } from '../test-state-updater/test-state-updater.module';

@Module({
  imports: [DatabaseModule, StateUpdaterModule],
  controllers: [DetectionController],
  providers: [DetectionPublisherService, DetectionListenerService],
})
export class DetectionModule { }
