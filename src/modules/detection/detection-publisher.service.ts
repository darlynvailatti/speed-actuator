import { Injectable, Logger } from '@nestjs/common';
import { Constants } from 'src/constants/constants';
import { RedisDatabase } from '../database/redis.database';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';

@Injectable()
export class DetectionPublisherService {
  private readonly logger = new Logger(DetectionPublisherService.name);

  constructor(private readonly redisDatabase: RedisDatabase) {}

  async detectionReception(sensorDetectionMessage: SensorDetectionMessage) {
    const redisPubClient = this.redisDatabase.getPublisherClient();
    this.logger.log(`publishing received detection: ${sensorDetectionMessage}`);

    redisPubClient.publish(
      Constants.SENSOR_DETECTION_BROKER_CHANNEL,
      JSON.stringify(sensorDetectionMessage),
    );
  }
}
