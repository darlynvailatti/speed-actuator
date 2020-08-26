import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Constants } from 'src/constants/constants';

@Injectable()
export class RedisDatabase {
  private readonly logger = new Logger(RedisDatabase.name);

  constructor(readonly redisService: RedisService) {}

  private getClient(name: string): any {
    return this.redisService.getClient(name);
  }

  getRepositoryClient(): any {
    return this.getClient(Constants.REDIS_REPOSITORY_CLIENT_NAME);
  }

  getPublisherClient(): any {
    return this.getClient(Constants.REDIS_CLIENT_PUBLISHER);
  }

  getSubscriberClient(): any {
    return this.getClient(Constants.REDIS_CLIENT_SUBSCRIBER);
  }

  subscribeOnChannelAndRegisterCallback(
    channelToSubscribe: string,
    callBack: any,
  ) {
    try {
      this.logger.log(
        `subscribing and registering ${channelToSubscribe} with callBack: ${callBack}`,
      );

      const redisSubClient = this.getSubscriberClient();

      redisSubClient.subscribe(channelToSubscribe);
      redisSubClient.on('message', (channel, message) => {
        if (channel === channelToSubscribe) callBack(message);
      });
    } catch (error) {
      const formattedLog = `Error on subscribe and register on channel ${channelToSubscribe} listener: ${error}`;
      this.logger.error(formattedLog, error);
      throw new Error(formattedLog);
    }
  }
}
