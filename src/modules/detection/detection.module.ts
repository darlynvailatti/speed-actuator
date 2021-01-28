import { Module } from '@nestjs/common';
import { DetectionController } from './detection.controller';
import { DetectionPublisherService } from './detection-publisher.service';
import { DatabaseModule } from '../database/database.module';
import { DetectionListenerService } from './detection-listener.service';
import { StateEngineModule } from '../test-engine/test-engine.module';

@Module({
  imports: [DatabaseModule, StateEngineModule],
  controllers: [DetectionController],
  providers: [DetectionPublisherService, DetectionListenerService],
})
export class DetectionModule {}
