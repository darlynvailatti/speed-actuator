import { Controller, Get, Param } from '@nestjs/common';
import { TestViewDTO } from 'src/models/view/dto/test-view.dto';
import { TestViewService } from './test-view.service';

@Controller('test-view')
export class TestViewController {

    constructor(private readonly testViewService: TestViewService){}

    @Get('/:testCode')
    async get(@Param('testCode') testCode: string): Promise<TestViewDTO> {
        return await this.testViewService.getTestView(testCode)
    }


}
