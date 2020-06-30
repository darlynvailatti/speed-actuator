import { Controller, HttpException, HttpStatus, Get } from '@nestjs/common';
import { StopWatcherGatewayService } from './stop-watcher-gateway.service';

@Controller('stop-watcher')
export class StopwatchController {

    constructor(
        private readonly stopWatcherGateway: StopWatcherGatewayService
    ){
        
    }

    @Get('/all')
    async getAllStopWatchers() {
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
