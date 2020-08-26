import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Constants } from 'src/constants/constants';
import { RedisDatabase } from '../database/redis.database';
import { StateUpdaterService as TestStateUpdaterService } from './test-state-updater.service';

@Injectable()
export class DetectionListenerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DetectionListenerService.name);

  constructor(
    private readonly redisDatabase: RedisDatabase,
    private readonly testStateUpdaterService: TestStateUpdaterService,
  ) {}

  onApplicationBootstrap() {
    this.subscribeAndRegisterMessageListener();
  }

  private subscribeAndRegisterMessageListener() {
    const channel = Constants.SENSOR_DETECTION_BROKER_CHANNEL;
    const callBack = this.handle.bind(this);
    this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack);
  }

  private handle(message: string) {
    if (!message && message.length <= 0) return;

    this.testStateUpdaterService.processDetection(message);
  }
}
