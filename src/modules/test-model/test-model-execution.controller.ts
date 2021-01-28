import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { TestService } from './test-model.service';
import { TestState } from 'src/models/execution/test';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { PostTest } from 'src/models/execution/post-test';
import { Test } from 'src/models/execution/test';

@Controller('test')
export class TestModelExecutionController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: 'Post Test' })
  @ApiResponse({ status: 201, type: Test })
  @ApiTags(ConstantsApiTags.LAB_API_TAG)
  @Post()
  async postTest(@Body() test: PostTest): Promise<void> {
    try {
      await this.testService.postTest(test);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on post test: ${error.message}`,
      );
    }
  }

  @ApiOperation({ summary: 'Cancel test execution' })
  @ApiTags(ConstantsApiTags.EXECUTION_API_TAG)
  @Put('/:testCode/execution/cancel')
  async cancelTest(@Param('testCode') testCode: string) {
    try {
      await this.testService.changeState(testCode, TestState.CANCELLED);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Put test in Ready' })
  @ApiTags(ConstantsApiTags.EXECUTION_API_TAG)
  @Put('/:testCode/execution/ready')
  async setToReady(@Param('testCode') testCode: string) {
    try {
      await this.testService.changeState(testCode, TestState.READY);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
