import { Injectable, Logger, InternalServerErrorException, OnApplicationBootstrap } from "@nestjs/common";
import {Constants} from "src/constants/constants";
import { ExecutionStateGateway as ExecutionStateWS } from "./execution-state-ws.service";
import { RedisDatabase } from "../database/redis.service";

@Injectable()
export class StateUpdateListenerService implements OnApplicationBootstrap {

    private readonly logger = new Logger(StateUpdateListenerService.name)

    constructor(
        private readonly executionStateWS: ExecutionStateWS,
        private readonly redisDatabase: RedisDatabase
    ) { }

    onApplicationBootstrap() {
        this.subscribeAndRegisterMessageListener();
    }

    subscribeAndRegisterMessageListener(): void {
        try {
            this.logger.log(`subscribing and registering ${Constants.TEST_UPDATE_STATE_CHANELL}...`);
        
            const redisSubClient = this.redisDatabase.getSubscriberClient()

            redisSubClient.subscribe(Constants.TEST_UPDATE_STATE_CHANELL);
            redisSubClient.on("message", (channel, message) => {
                if (channel === Constants.TEST_UPDATE_STATE_CHANELL)
                    this.testUpdateStateListener(message);
            })
        } catch (error) {
            const formattedLog = `Error on subscribe and register on channel ${Constants.TEST_UPDATE_STATE_CHANELL} listener: ${error}`;
            this.logger.error(formattedLog, error);
            throw new InternalServerErrorException(formattedLog)
        }
    }

    testUpdateStateListener(message): void {
        this.logger.log(`receive message: ${message}`);

        // ... do a lot of things

        this.executionStateWS.publishEventOnTestViewChannel(JSON.stringify(message))
    }

}