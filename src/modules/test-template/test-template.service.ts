import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTestTemplateDTO } from 'src/models/template/dto/create-test-template.dto';
import { TestTemplateFullDTO, TestTemplateFullDTOConverter } from 'src/models/template/dto/test-template-full.dto';
import { TestTemplateRepository } from 'src/modules/database/test-template-repository.service';
import { TestTemplateFactory, TestTemplate, TestTemplateDocument } from 'src/models/template/test.template';
import { UpdateTestTemplateDTO } from 'src/models/template/dto/update-test-template.dto';
import { Graph } from 'src/models/template/graph';
import { GraphDTOConverter } from 'src/models/template/dto/graph.dto';
import { TestTemplateValidatorService } from './validation/test-template-validator.service';

@Injectable()
export class TestTemplateService {

    constructor(
        private readonly testTemplateRepository: TestTemplateRepository,
        private readonly testTemplateValidatorService: TestTemplateValidatorService
    ){}

    async createNew(createNew: CreateTestTemplateDTO): Promise<TestTemplateFullDTO> {

        const description = createNew.description
        const numberOfTurns = createNew.numberOfTurns

        const newTestTemplate : TestTemplate = TestTemplateFactory.build({
            description: description,
            numberOfTurns: numberOfTurns
        })

        const createdTestTemplate = await this.testTemplateRepository.createNew(newTestTemplate)
    
        return {
            code: createdTestTemplate.code,
            description: createdTestTemplate.description,
            numberOfTurns: createdTestTemplate.numberOfTurns
        }
    }

    async find(code: string) : Promise<TestTemplateFullDTO> {

        const found : TestTemplate = await this.testTemplateRepository.findOne(code)
    
        if(!found)
            return null

        return TestTemplateFullDTOConverter.convertToDTO(found)
    }


    async update(updateDTO: UpdateTestTemplateDTO): Promise<any> {
        
        /*
            1. If any test execution already did, then can't update template
            2. Validate the graph
         */

        const code = updateDTO.code
        const testTemplate : TestTemplate = await this.testTemplateRepository.findOne(code)
    
        if(!testTemplate)
            throw new InternalServerErrorException(`TestTemplate not found for code ${code}`)

        testTemplate.description = updateDTO.description
        testTemplate.numberOfTurns = updateDTO.numberOfTurns

        const graphModel : Graph = GraphDTOConverter.convertToModel(updateDTO.graph)
        testTemplate.graph = graphModel

        const validation = await this.testTemplateValidatorService.validate({
            testTemplate: testTemplate
        })

        if(!validation.isValid){
            throw new InternalServerErrorException(validation.causeIfIsNotValid)
        }

        const updatedTest = await this.testTemplateRepository.update(testTemplate)
        return TestTemplateFullDTOConverter.convertToDTO(updatedTest)
    }
}
