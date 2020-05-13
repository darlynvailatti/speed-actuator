import { Injectable, Logger } from '@nestjs/common';
import { Constants } from 'src/constants/constants'
import { SensorDetectionMessageDTO, ConverterSensorDetectionMessageDTO } from 'src/models/sensor/dto/sensor/sensor-message-dto';
import { RedisDatabase } from '../database/redis.service';

@Injectable()
export class DetectionPublisherService {

  private readonly logger = new Logger(DetectionPublisherService.name)

  constructor(
    private readonly redisDatabase: RedisDatabase
  ) { }


  async detectionReception(dto: SensorDetectionMessageDTO) {
    const redisPubClient = this.redisDatabase.getPublisherClient()
    this.logger.log(`should be false:  ${redisPubClient.condition.subscriber}`)
    const entity = ConverterSensorDetectionMessageDTO.convert(dto)
    
    redisPubClient.publish(Constants.SENSOR_DETECTION_BROKER_CHANNEL, JSON.stringify(entity))

  }

}
