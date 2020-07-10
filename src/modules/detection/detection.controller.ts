import { Controller, Post, Body, Logger, Put } from '@nestjs/common';
import { DetectionPublisherService } from './detection-publisher.service';
import { SensorDetectionMessageDTO } from 'src/models/sensor/dto/sensor/sensor-message-dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';

@Controller("detection")
export class DetectionController {
  
  private readonly logger = new Logger(DetectionController.name)

  constructor(private readonly appService: DetectionPublisherService) {}

  @ApiOperation({summary: 'Receive new detection'})
  @ApiTags(ConstantsApiTags.DETECTION_API_TAG)
  @Put()
  detectionReception(@Body() sensorDetectionMessageDTO: SensorDetectionMessageDTO): void {
    this.appService.detectionReception(sensorDetectionMessageDTO);
  }
}
