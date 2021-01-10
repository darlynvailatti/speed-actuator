import { Injectable, Logger } from '@nestjs/common';
import { RedisConstants } from 'src/constants/constants';
import { RedisDatabase } from '../database/redis.database';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';

@Injectable()
export class DetectionPublisherService {
  private readonly logger = new Logger(DetectionPublisherService.name);

  constructor(private readonly redisDatabase: RedisDatabase) {}

  async detectionReception(sensorDetectionMessage: SensorDetectionMessage) {
    let redisPubClient = this.redisDatabase.getPublisherClient();
    this.logger.log(`Publishing received detection on ${RedisConstants.SENSOR_DETECTION_BROKER_CHANNEL}: ${JSON.stringify(sensorDetectionMessage)}`);
    redisPubClient.publish(
      RedisConstants.SENSOR_DETECTION_BROKER_CHANNEL,
      JSON.stringify(sensorDetectionMessage),
    );
  }
}
