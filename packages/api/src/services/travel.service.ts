import { Injectable } from '@nestjs/common';
import { CreateTravelDto } from 'src/dto/create-travel.dto';
import { FoundRouteDto } from 'src/dto/round-route.dto';

@Injectable()
export class TravelService {
  private travels = [];
  private foundRoutes = [];

  createTravel(travel: CreateTravelDto) {
    this.travels.push(travel);
    return travel;
  }

  createFoundRoute(route: FoundRouteDto) {
    this.foundRoutes.push(route);
    return route;
  }

  findAllTravels() {
    return this.travels;
  }

  findAllFoundRoutes() {
    return this.foundRoutes;
  }
}