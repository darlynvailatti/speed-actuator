import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  NotFoundException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CreateTestTemplateDTO } from 'src/models/template/dto/create-test-template.dto';
import { TestTemplateFullDTO } from 'src/models/template/dto/test-template-full.dto';
import { TestTemplateService } from './test-template.service';
import { UpdateTestTemplateDTO } from 'src/models/template/dto/update-test-template.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';

@Controller('/test-template')
export class TestTemplateController {
  constructor(private readonly testTemplateService: TestTemplateService) {}

  @ApiOperation({ summary: 'Create new test template' })
  @ApiResponse({ status: 201, type: TestTemplateFullDTO })
  @ApiTags(ConstantsApiTags.LAB_API_TAG)
  @Post()
  async createNew(
    @Body() createNew: CreateTestTemplateDTO,
  ): Promise<TestTemplateFullDTO> {
    return await this.testTemplateService.createNew(createNew);
  }

  @ApiOperation({ summary: 'Get test template by code' })
  @ApiTags(ConstantsApiTags.VIEW_API_TAG)
  @Get('/:code')
  async findOne(@Res() res, @Param('code') code: string) {
    const foundTesTemplate = await this.testTemplateService.find(code);
    if (!foundTesTemplate)
      throw new NotFoundException(`Not found TestTemplate with code ${code}`);
    res.status(HttpStatus.OK).json(foundTesTemplate);
  }

  @ApiOperation({ summary: 'Update test template' })
  @ApiResponse({ status: 200, type: TestTemplateFullDTO })
  @Patch()
  @ApiTags(ConstantsApiTags.LAB_API_TAG)
  async update(@Res() res, @Body() updateDTO: UpdateTestTemplateDTO) {
    const updatedTestTemplate = await this.testTemplateService.update(
      updateDTO,
    );
    res.status(HttpStatus.OK).json(updatedTestTemplate).json;
  }
}
