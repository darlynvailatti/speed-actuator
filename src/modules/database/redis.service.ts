import { Injectable } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import { Constants } from "src/constants/constants";

@Injectable()
export class RedisDatabase {

    constructor(readonly redisService: RedisService) {}

    private getClient(name:string): any {
        return this.redisService.getClient(name)
    }

    getPublisherClient():any{
        return this.getClient(Constants.REDIS_CLIENT_PUBLISHER)
    }

    getSubscriberClient():any{
        return this.getClient(Constants.REDIS_CLIENT_SUBSCRIBER)
    }

}