import { Controller, Post, Body, Get, Param, Res, NotFoundException, HttpStatus, Patch } from '@nestjs/common';
import { CreateTestTemplateDTO } from 'src/models/template/dto/create-test-template.dto';
import { TestTemplateFullDTO } from 'src/models/template/dto/test-template-full.dto';
import { TestTemplateService } from './test-template.service';
import { UpdateTestTemplateDTO } from 'src/models/template/dto/update-test-template.dto';

@Controller('/test-template')
export class TestTemplateController {

    constructor(private readonly testTemplateService: TestTemplateService){}

    @Post()
    async createNew(@Body() createNew: CreateTestTemplateDTO): Promise<TestTemplateFullDTO> {
        return await this.testTemplateService.createNew(createNew)
    }

    @Get('/:code')
    async findOne(@Res() res, @Param('code') code: string) {    
        const foundTesTemplate = await this.testTemplateService.find(code)  
        if(!foundTesTemplate)
            throw new NotFoundException(`Not found TestTemplate with code ${code}`)    
        res.status(HttpStatus.OK).json(foundTesTemplate)
    }

    @Patch()
    async update(@Res() res, @Body() updateDTO: UpdateTestTemplateDTO) {
        const updatedTestTemplate = await this.testTemplateService.update(updateDTO)
        res.status(HttpStatus.OK).json(updatedTestTemplate).json
    }

}
