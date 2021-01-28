import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RedisConstants } from 'src/constants/constants';
import { TestStateWebsocket } from './test-state-websocket.service';
import { RedisDatabase } from '../database/redis.database';

@Injectable()
export class TestStateListenerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TestStateListenerService.name);

  constructor(
    private readonly testStateWebsocket: TestStateWebsocket,
    private readonly redisDatabase: RedisDatabase,
  ) {}

  onApplicationBootstrap() {
    this.subscribeAndRegisterMessageListener();
  }

  private subscribeAndRegisterMessageListener(): void {
    const channel = RedisConstants.TEST_UPDATE_STATE_CHANNEL;
    const callBack = this.handle.bind(this);
    this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack);
  }

  private handle(message: string): void {
    //this.logger.log(`receive message: ${message}`);
    this.testStateWebsocket.publishEventOnTestViewChannel(
      JSON.stringify(message),
    );
  }
}
