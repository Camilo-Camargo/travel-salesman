import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TravelService } from './services/travel.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { FoundRouteDto } from './dto/round-route.dto';

@WebSocketGateway()
export class TravelGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly travelService: TravelService) { }

  @SubscribeMessage('createTravel')
  handleCreateTravel(@MessageBody() createTravelDto: CreateTravelDto) {
    const travel = this.travelService.createTravel(createTravelDto);
    this.server.emit('travelCreated', travel);
    return travel;
  }

  @SubscribeMessage('createFoundRoute')
  handleCreateFoundRoute(@MessageBody() foundRouteDto: FoundRouteDto[]) {
    const createdRoutes = foundRouteDto.map(route => this.travelService.createFoundRoute(route));
    this.server.emit('foundRouteCreated', createdRoutes);
    return createdRoutes;
  }
}