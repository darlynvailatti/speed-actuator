import { Module } from '@nestjs/common';
import { DetectionController } from './detection.controller';
import { DetectionPublisherService } from './detection-publisher.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DetectionController],
  providers: [DetectionPublisherService],
})
export class DetectionModule { }
