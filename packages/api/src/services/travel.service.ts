import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { CreateTravelDto } from 'src/dto/create-travel.dto';
import { FoundRouteDto } from 'src/dto/round-route.dto';

@Injectable()
export class TravelService {
  private travels = [];
  private foundRoutes = [];
  private server: Server;
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://10.21.0.5:3000";
  }


  setServer(server: Server) {
    this.server = server;
  }

  async updateMatrix(data: any) {
    return await this.apiPost('/matrix', data);
  }

  async getMatrix(){
    return await this.apiGet('/matrix');
  }

  createTravel(travel: CreateTravelDto) {
    this.travels.push(travel);

    if (this.server) {
      this.server.emit('travels:created', travel);
    }

    return travel;
  }

  foundRoute(route: Array<FoundRouteDto>) {
    this.foundRoutes.push(route);

    if (this.server) {
      this.server.emit('routes:found', route);
    }

    return route;
  }
  findAllTravels() {
    return this.travels;
  }

  findAllFoundRoutes() {
    return this.foundRoutes;
  }


  private async apiPost(path: string, data?: {}) {
    const res = await fetch(`${this.apiUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const resJson = await res.json();
    return resJson;
  }

  private async apiGet(path: string) {
    const res = await fetch(`${this.apiUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    const resJson = await res.json();
    return resJson;
  }


}
