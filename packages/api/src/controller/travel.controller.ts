import { Controller, Post, Body, Get } from '@nestjs/common';
import { TravelService } from 'src/services/travel.service';
import { CreateTravelDto } from 'src/dto/create-travel.dto';
import { FoundRouteDto } from 'src/dto/round-route.dto';

@Controller('/api/travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) { }

  @Post('matrix')
  async updateMatrix(@Body() body) {
    return this.travelService.updateMatrix(body);
  }

  @Get('matrix')
  async getMatrix() {
    return this.travelService.getMatrix();
  }

  @Post('find')
  createTravel(@Body() createTravelDto: CreateTravelDto) {
    return this.travelService.createTravel(createTravelDto);
  }

  @Post('found-route')
  createRoundRoute(@Body() foundRouteDto: FoundRouteDto[]) {
    return this.travelService.foundRoute(foundRouteDto);
  }
}
