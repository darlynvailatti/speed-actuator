import { Controller, HttpException, HttpStatus, Get } from '@nestjs/common';
import { StopWatcherGatewayService } from './stop-watcher-gateway.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { StopwatchTestDTO } from 'src/models/view/dto/stop-watcher.dto';


@Controller('stop-watcher')
export class StopwatchController {

    constructor(
        private readonly stopWatcherGateway: StopWatcherGatewayService
    ){
        
    }

    @ApiOperation({summary: 'Get all stopwatchers alive'})
    @ApiResponse({status: 200, type: [StopwatchTestDTO]})
    @ApiTags(ConstantsApiTags.VIEW_API_TAG)
    @Get('/all')
    async getAllStopWatchers() : Promise<Array<StopwatchTestDTO>>{
        try {
            return this.stopWatcherGateway.getAllInStack()
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message
              }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    

}
