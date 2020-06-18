import { OnApplicationBootstrap, Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { RedisDatabase } from "../database/redis.service";
import { Constants } from "src/constants/constants";
import { TestTemplateRepository } from "../database/test-template-repository.service";
import { TestViewDTO } from "src/models/view/dto/test-view.dto";
import { TestRepositoryService } from "../database/test-repository.service";
import { Test } from "src/models/execution/test";
import { ProcessorStopWatcher } from "./processor/processor-stop-watcher";
import { TestTemplate } from "src/models/template/test.template";

@Injectable()
export class StopWatcherGatewayService implements OnApplicationBootstrap {

    private readonly logger = new Logger(StopWatcherGatewayService.name)

    constructor(
        private readonly redisDatabase: RedisDatabase,
        private readonly testTemplateRepositoryService: TestTemplateRepository,
        private readonly testRespositoryService: TestRepositoryService
    ) { }

    onApplicationBootstrap() {
        this.logger.log(`Initializing...`)
        const channel = Constants.TEST_UPDATE_STATE_CHANNEL;
        const callBack = this.handle.bind(this)
        this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack)
    }

    private async handle(message: string){
        this.logger.log(`Handle stop watch: ${message}`)

        if(!message || message.length <= 0)
            return;

        const testViewDTO : TestViewDTO = JSON.parse(message)
        const test : Test = await this.testRespositoryService.findOne(testViewDTO.code)

        if(!test){
            this.logger.log(`Can't find test with code ${testViewDTO.code}`)
            return;
        }
            
        const templateCode = test.template.code;
        const template : TestTemplate = await this.testTemplateRepositoryService.findOne(templateCode)
        
        const processorCheckIfNeedStopWatch = new ProcessorStopWatcher(
            test.testExecution,
            template,
            () => {
                console.log(`Executing timeout stop watch`)
            }
        )

        processorCheckIfNeedStopWatch.execute()

        //this.testTemplateRepositoryService.findOne()
    }



}
