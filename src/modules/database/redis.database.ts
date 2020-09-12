import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { RedisConstants } from 'src/constants/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisDatabase {
  private readonly logger = new Logger(RedisDatabase.name);

  constructor(
    readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private getClient(name: string): any {
    return this.redisService.getClient(name);
  }

  getRepositoryClient(): any {
    const repositoryClient = this.configService.get(
      RedisConstants.REDIS_REPOSITORY_CLIENT_NAME,
    );
    return this.getClient(repositoryClient);
  }

  getPublisherClient(): any {
    const publicsherClient = this.configService.get(
      RedisConstants.REDIS_CLIENT_PUBLISHER,
    );
    return this.getClient(publicsherClient);
  }

  getSubscriberClient(): any {
    const subscriberClient = this.configService.get(
      RedisConstants.REDIS_CLIENT_SUBSCRIBER,
    );
    return this.getClient(subscriberClient);
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
