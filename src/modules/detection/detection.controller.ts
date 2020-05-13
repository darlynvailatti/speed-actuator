import { Controller, Post, Body, Logger } from '@nestjs/common';
import { DetectionPublisherService } from './detection-publisher.service';
import { SensorDetectionMessageDTO } from 'src/models/sensor/dto/sensor/sensor-message-dto';

@Controller("/detection")
export class DetectionController {
  
  private readonly logger = new Logger(DetectionController.name)

  constructor(private readonly appService: DetectionPublisherService) {}

  @Post()
  detectionReception(@Body() sensorDetectionMessageDTO: SensorDetectionMessageDTO): void {
    this.appService.detectionReception(sensorDetectionMessageDTO);
  }
}
