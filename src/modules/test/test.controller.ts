import { Controller, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateNewTestDTO } from 'src/models/execution/dto/create-new-test.dto';
import { TestDTO } from 'src/models/execution/dto/test.dto';
import { TestService } from './test.service';
import { TestState } from 'src/models/execution/test';

@Controller('test')
export class TestExecutionController {

    constructor(
        private readonly testService: TestService
    ){

    }

    @Post()
    createNewTest(@Body() createNewTestDTO: CreateNewTestDTO): Promise<TestDTO> {
        return this.testService.createNewTest(createNewTestDTO)
    }
    
    @Post('/:testCode/execution/cancel')
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

    @Post('/:testCode/execution/ready')
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
