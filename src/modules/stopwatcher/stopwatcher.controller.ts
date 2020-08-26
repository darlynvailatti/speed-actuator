import { Controller, HttpException, HttpStatus, Get } from '@nestjs/common';
import { StopwatcherGatewayService } from './stopwatcher-gateway.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { StopwatchProcess } from 'src/models/execution/stopwatcher-processor';

@Controller('stop-watcher')
export class StopwatchController {
  constructor(private readonly stopWatcherGateway: StopwatcherGatewayService) {}

  @ApiOperation({ summary: 'Get all stopwatchers alive' })
  @ApiResponse({ status: 200, type: [StopwatchProcess] })
  @ApiTags(ConstantsApiTags.VIEW_API_TAG)
  @Get('/all')
  async getAllStopwatchersProcessors(): Promise<Array<StopwatchProcess>> {
    try {
      return this.stopWatcherGateway.getAllStopwatchProcessorInStack();
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
