import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateNewTestDTO } from 'src/models/execution/dto/create-new-test.dto';
import { TestDTO } from 'src/models/execution/dto/test.dto';
import { TestRepositoryService } from '../database/test-repository.service';
import { TestTemplateService } from '../test-template/test-template.service';
import { TestState, Test } from 'src/models/execution/test';
import { TestStateMachine } from './impl/test-state-machine';

@Injectable()
export class TestService {
    
    private readonly logger = new Logger(TestService.name)

    constructor(
        private readonly testRepositoryService: TestRepositoryService,
        private readonly testTemplateService: TestTemplateService
    ) { }

    async createNewTest(createNewTestDTO: CreateNewTestDTO): Promise<TestDTO> {

        this.logger.log(`New request - create new Test: ${JSON.stringify(createNewTestDTO)}`)

        const description = createNewTestDTO.description
        let numberOfTurns = createNewTestDTO.numberOfTurns

        const testTemplateCode = createNewTestDTO.testTemplate.code


        const testTemplate = await this.testTemplateService.find(testTemplateCode)
        if (!testTemplate)
            throw new InternalServerErrorException(`Can't find TestTemplate with ID ${testTemplateCode}`)

        if (!numberOfTurns || numberOfTurns === 0)
            numberOfTurns = testTemplate.numberOfTurns

        const newTest: Test = {
            description: description,
            numberOfTurns: numberOfTurns,
            template: {
                code: testTemplateCode
            },
            state: TestState.IDLE,
            athlete: null
        }

        const createdTest = await this.testRepositoryService.createNewTest(newTest)

        this.logger.log(`Created Test: ${JSON.stringify(createdTest)}`)

        return {
            code: createdTest.code,
            description: createdTest.description,
            testTemplate: {
                code: createdTest.template.code
            }
        }

    }

    async changeToReady(testCode: string) {

        const foundReadyTest = await this.testRepositoryService.findReadyOrStarted()

        if(foundReadyTest && foundReadyTest.code != testCode)
            throw new Error(`Another test (${foundReadyTest.code}) is already ready to start`)

        await this.changeState(testCode, TestState.READY)    

    }

    async changeState(testCode: string, newState: TestState) {

        try {

            const foundTest = await this.foundTestOrThrowError(testCode)
            const isAlreadyInThisState = foundTest.state === newState
            if(isAlreadyInThisState)
                throw new Error(`Test ${testCode} is already ${newState}`)
            TestStateMachine.change(foundTest, newState)
            await this.testRepositoryService.update(foundTest)
        
        } catch (error) {
            throw new Error(`Error when start Test: ${error.message}`)
        }
    }

    async updateTest(test: Test) : Promise<Test> {
        return await this.testRepositoryService.update(test)
    }
    
    private async foundTestOrThrowError(testCode: string) : Promise<Test>{
        const foundTest = await this.testRepositoryService.findOne(testCode)

        if(!foundTest)
            throw new Error(`Can't find Test with code ${testCode}`)

        return foundTest
    }

}
