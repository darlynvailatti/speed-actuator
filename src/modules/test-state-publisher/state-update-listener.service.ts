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

    private subscribeAndRegisterMessageListener(): void {
       
        const channel = Constants.TEST_UPDATE_STATE_CHANNEL;
        const callBack = this.handle.bind(this)
        this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack)
         
    }

    private handle(message: string): void {
        this.logger.log(`receive message: ${message}`);
        this.executionStateWS.publishEventOnTestViewChannel(JSON.stringify(message))
    }

}