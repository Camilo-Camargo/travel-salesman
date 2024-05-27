import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { CreateTravelDto } from 'src/dto/create-travel.dto';
import { FoundRouteDto } from 'src/dto/round-route.dto';

@Injectable()
export class TravelService {
  private travels = [];
  private foundRoutes = [];
  private server: Server;

  
  setServer(server: Server) {
    this.server = server;
  }

  createTravel(travel: CreateTravelDto) {
    this.travels.push(travel);
    
    if (this.server) {
      this.server.emit('travelCreated', travel);
    }
    return travel;
  }

  createFoundRoute(route: Array<FoundRouteDto>) {
    this.foundRoutes.push(route);

    if (this.server) {
      this.server.emit('foundRouteCreated', route);
    }
    return route;
  }
  findAllTravels() {
    return this.travels;
  }

  findAllFoundRoutes() {
    return this.foundRoutes;
  }
}