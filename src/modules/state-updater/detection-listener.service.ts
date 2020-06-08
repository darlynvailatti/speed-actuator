import { Injectable, InternalServerErrorException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Constants } from 'src/constants/constants';
import { RedisDatabase } from '../database/redis.service';
import { StateUpdaterService as TestStateUpdaterService } from './state-updater.service';


@Injectable()
export class DetectionListenerService implements OnApplicationBootstrap {
  
  private readonly logger = new Logger(DetectionListenerService.name)

  constructor(
    private readonly redisDatabase: RedisDatabase,
    private readonly testStateUpdaterService: TestStateUpdaterService,
  ) { }

  onApplicationBootstrap() {
    this.subscribeAndRegisterMessageListener();
  }

  private subscribeAndRegisterMessageListener() {
    try {
      this.logger.log(`subscribing and registering on ${Constants.SENSOR_DETECTION_BROKER_CHANNEL}...`);

      const redisSubClient = this.redisDatabase.getSubscriberClient()
    
      redisSubClient.subscribe(Constants.SENSOR_DETECTION_BROKER_CHANNEL);
      redisSubClient.on("message", (channel, message) => {
        if(channel === Constants.SENSOR_DETECTION_BROKER_CHANNEL)
          this.testStateUpdaterService.processDetection(message);
      })
    } catch (error) {
      const formattedLog = `Error on subscribe and register message sensor detection listener: ${error}`;
      this.logger.error(formattedLog, error);
      throw new InternalServerErrorException(formattedLog) 
    }
  }

 

}
