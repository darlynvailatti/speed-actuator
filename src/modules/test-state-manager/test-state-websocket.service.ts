import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  BaseWsExceptionFilter,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { RedisConstants } from '../../constants/constants';
import { Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class TestStateWebsocket {
  private logger: Logger = new Logger(TestStateWebsocket.name);

  @WebSocketServer() private server: Server;

  async afterInit(server: any) {
    this.logger.log(`Websocket initialized...`);
  }

  async handleDisconnect(client: any) {
    this.logger.log(`Handle websocket client ${client} disconnect...`);
  }

  async handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Handle websocket client connection: ${client}`);
    //console.log(client);
  }

  @SubscribeMessage(RedisConstants.TEST_VIEW_CHANNEL_WS)
  async onReceiveEventOnTestViewChannel(@MessageBody() message: string) {
    //this.logger.log(`received message on ${Constants.TEST_VIEW_CHANNEL_WS}: ${message}`)
  }

  public async publishEventOnTestViewChannel(message: string) {
    //this.logger.log(`publishing event on ${Constants.TEST_VIEW_CHANNEL_WS}: ${message}`)
    this.server.emit(RedisConstants.TEST_VIEW_CHANNEL_WS, message);
  }

  @UseFilters(new BaseWsExceptionFilter())
  @SubscribeMessage('events')
  onEvent(client, data: any): WsResponse<any> {
    const event = 'events';
    console.log('ERROR');
    return { event, data };
  }
}
