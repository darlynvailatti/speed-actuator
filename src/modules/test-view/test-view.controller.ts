import { Controller, Get, Param } from '@nestjs/common';
import { TestViewDTO } from 'src/models/view/dto/test-view.dto';
import { TestDTO } from 'src/models/execution/dto/test.dto';
import { TestViewService } from './test-view.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';

@Controller('test-view')
export class TestViewController {

    constructor(private readonly testViewService: TestViewService){}

    @ApiOperation({summary: 'Get test view by code'})
    @ApiResponse({status: 200, type: TestViewDTO})
    @ApiTags(ConstantsApiTags.VIEW_API_TAG)
    @Get('/:testCode')
    async get(@Param('testCode') testCode: string): Promise<TestViewDTO> {
        return await this.testViewService.getTestView(testCode)
    }

    @ApiOperation({summary: 'Get all tests in execution'})
    @ApiResponse({status:200, type: [TestDTO]})
    @ApiTags(ConstantsApiTags.VIEW_API_TAG)
    @Get('/all/execution')
    async getAllInExecution() : Promise<Array<TestDTO>>{
        return await this.testViewService.getAllInExecution()
    }


}
