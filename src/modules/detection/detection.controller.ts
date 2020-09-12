import { Controller, Body, Logger, Put } from '@nestjs/common';
import { DetectionPublisherService } from './detection-publisher.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';

@Controller('detection')
export class DetectionController {
  private readonly logger = new Logger(DetectionController.name);

  constructor(private readonly appService: DetectionPublisherService) {}

  @ApiOperation({ summary: 'Receive new detection' })
  @ApiTags(ConstantsApiTags.DETECTION_API_TAG)
  @Put()
  detectionReception(
    @Body() sensorDetectionMessage: SensorDetectionMessage,
  ): void {
    this.appService.detectionReception(sensorDetectionMessage);
  }
}
