import { Controller, HttpException, HttpStatus, Get } from '@nestjs/common';
import { StopwatcherGatewayService } from './stopwatcher-gateway.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConstantsApiTags } from 'src/constants/constants';
import { StopwatchProcess } from 'src/models/execution/stopwatcher-process';
import StopwatchProcessDTO, {
  StopwatchDTOConverter,
} from './model/stopwatch-model-dto';

@Controller('stopwatch')
export class StopwatchController {
  constructor(private readonly stopWatcherGateway: StopwatcherGatewayService) {}

  @ApiOperation({ summary: 'Get all stopwatchers alive' })
  @ApiResponse({ status: 200, type: [StopwatchProcessDTO] })
  @ApiTags(ConstantsApiTags.VIEW_API_TAG)
  @Get('/all')
  async getAllStopwatchersProcessors(): Promise<Array<StopwatchProcessDTO>> {
    try {
      const stopwatchersProcesses = this.stopWatcherGateway.getAllStopwatchProcessorInStack();
      if (stopwatchersProcesses) {
        const stopwatchersDTO = [];
        stopwatchersProcesses
          .map(s => new StopwatchDTOConverter(s).convert())
          .map(s => stopwatchersDTO.push(s));
        return stopwatchersDTO;
      }
      return [];
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
