import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { TestViewService } from './test-view.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { Test } from 'src/models/execution/test';
import { TestView } from 'src/models/view/test-view';

@Controller('test-view')
export class TestViewController {
  constructor(private readonly testViewService: TestViewService) {}

  @ApiOperation({ summary: 'Get test view by code' })
  @ApiResponse({ status: 200, type: Test })
  @ApiTags(ConstantsApiTags.VIEW_API_TAG)
  @Get('/:testCode')
  async get(@Param('testCode') testCode: string): Promise<TestView> {
    try {
      return await this.testViewService.getTestView(testCode);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiOperation({ summary: 'Get all tests in execution' })
  @ApiResponse({ status: 200, type: [Test] })
  @ApiTags(ConstantsApiTags.VIEW_API_TAG)
  @Get('/all/execution')
  async getAllInExecution(): Promise<Array<Test>> {
    return await this.testViewService.getAllInExecution();
  }
}
