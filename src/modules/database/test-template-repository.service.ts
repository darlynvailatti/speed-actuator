import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TestTemplateDocument, TestTemplate } from 'src/models/template/test.template';
import { Model } from 'mongoose';
import { SequenceGeneratorService } from './sequence-generator.service';

@Injectable()
export class TestTemplateRepository {

    private readonly SEQUENCE_NAME = 'test-template'

    constructor(
        private readonly sequenceGeneratorService: SequenceGeneratorService,
        @InjectModel('test-template') private readonly testTemplateModel: Model<TestTemplateDocument>,
        
        ) {}

    async createNew(testTemplate: TestTemplate) : Promise<TestTemplateDocument>{
        const code = await (this.sequenceGeneratorService.getNextAndSave(this.SEQUENCE_NAME))
        testTemplate.code = code.toLocaleString()
        return (await this.testTemplateModel.create(testTemplate)).toObject()
    }

    async findOne(code: string) : Promise<TestTemplate>{
        const filter = { code: code }
        return (await this.testTemplateModel.findOne(filter).exec()).toObject()
    }

    async update(updatedTest: TestTemplate) : Promise<TestTemplate>{

        const filter = { code: updatedTest.code }
        const update = { $set: { 
            description: updatedTest.description,
            numberOfTurns: updatedTest.numberOfTurns,
            graph: updatedTest.graph
        }}
        return (await this.testTemplateModel
            .findOneAndUpdate(filter, update, { new: true, })
            .exec()
            ).toObject()
    }

}
