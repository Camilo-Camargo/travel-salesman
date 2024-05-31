import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TravelService } from './services/travel.service';

@WebSocketGateway({cors: true})
export class TravelGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly travelService: TravelService) { }

  afterInit() {
    this.travelService.setServer(this.server);
  }
}
