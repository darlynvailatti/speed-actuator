import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { RedisConstants } from '../../constants/constants';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ExecutionStateGateway {
  private logger: Logger = new Logger(ExecutionStateGateway.name);

  @WebSocketServer() private server: Server;

  async afterInit(server: any) {
    this.logger.log(`Websocket initialized...`);
  }

  async handleDisconnect(client: any) {
    this.logger.log(`Handle websocket client ${client} disconnect...`);
  }

  async handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Handle websocket client connection: ${client}`);
  }

  @SubscribeMessage(RedisConstants.TEST_VIEW_CHANNEL_WS)
  async onReceiveEventOnTestViewChannel(@MessageBody() message: string) {
    //this.logger.log(`received message on ${Constants.TEST_VIEW_CHANNEL_WS}: ${message}`)
  }

  public async publishEventOnTestViewChannel(message: string) {
    //this.logger.log(`publishing event on ${Constants.TEST_VIEW_CHANNEL_WS}: ${message}`)
    this.server.emit(RedisConstants.TEST_VIEW_CHANNEL_WS, message);
  }
}
