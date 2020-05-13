import { Injectable, Logger } from "@nestjs/common";
import { SequenceGeneratorService } from "./sequence-generator.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TestDocument, Test, TestState } from "src/models/execution/test";


@Injectable()
export class TestRepositoryService {

    private readonly logger = new Logger(TestRepositoryService.name)

    private readonly SEQUENCE_NAME = 'test'

    constructor(
        private readonly sequenceGeneratorService : SequenceGeneratorService,
        @InjectModel('test') private readonly testModel: Model<TestDocument>
    ) {}

    
    async findOne(code: string) : Promise<Test> {
        const filter = { code:  code }
        const testDocument = await this.testModel.findOne(filter)
        if(!testDocument)
            return null
        return testDocument.toObject()
    }

    async findReadyOrStarted() : Promise<Test> {
        const filter = { 
            $or: [ 
                    { state: TestState.READY },
                    { state: TestState.STARTED }
                ] 
            }
        const testDocument = await this.testModel.findOne(filter)
        if(!testDocument) return null
        return testDocument.toObject()
    }

    async createNewTest(newTest: Test): Promise<Test> {
        const code = await (this.sequenceGeneratorService.getNextAndSave(this.SEQUENCE_NAME))
        this.logger.log(`Creating new Test: ${JSON.stringify(newTest)}`)
        newTest.code = code.toLocaleString()

        const testDocument = await this.testModel.create(newTest)
        if(!testDocument)
            return null
        return testDocument.toObject()
    }

    async update(test: Test) : Promise<Test> {
        
        const filter = { code: test.code }
        const update = { 
            description: test.description,
            numberOfTurns: test.numberOfTurns,
            state: test.state,
            testExecution: test.testExecution
        }
        const testDocument = await this.testModel.findOneAndUpdate(filter, update)
        if(!testDocument) return null

        return testDocument.toObject()
    }

}