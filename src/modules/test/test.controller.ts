import { Controller, Post, Body, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CreateNewTestDTO } from 'src/models/execution/dto/create-new-test.dto';
import { TestDTO } from 'src/models/execution/dto/test.dto';
import { TestService } from './test.service';
import { TestState } from 'src/models/execution/test';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';

@Controller('test')
export class TestExecutionController {

    constructor(
        private readonly testService: TestService
    ){

    }

    @ApiOperation({summary: 'Create new test'})
    @ApiResponse({status: 201, type: TestDTO})
    @ApiTags(ConstantsApiTags.LAB_API_TAG)
    @Post()
    createNewTest(@Body() createNewTestDTO: CreateNewTestDTO): Promise<TestDTO> {
        return this.testService.createNewTest(createNewTestDTO)
    }
    
    @ApiOperation({summary: 'Cancel test execution'})
    @ApiTags(ConstantsApiTags.EXECUTION_API_TAG)
    @Put('/:testCode/execution/cancel')
    async cancelTest(@Param('testCode') testCode: string) {
        try {
            await this.testService.changeState(testCode, TestState.CANCELLED)    
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @ApiOperation({summary: 'Put test in Ready'})
    @ApiTags(ConstantsApiTags.EXECUTION_API_TAG)
    @Put('/:testCode/execution/ready')
    async makeReady(@Param('testCode') testCode: string) {
        try {
            await this.testService.changeToReady(testCode)
            
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    

}
