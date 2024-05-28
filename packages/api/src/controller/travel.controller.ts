import { Controller, Post, Body } from '@nestjs/common';
import { TravelService } from 'src/services/travel.service';
import { CreateTravelDto } from 'src/dto/create-travel.dto';
import { FoundRouteDto } from 'src/dto/round-route.dto';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) { }

  @Post('find')
  createTravel(@Body() createTravelDto: CreateTravelDto) {
    return this.travelService.createTravel(createTravelDto);
  }

  @Post('found-route')
  createRoundRoute(@Body() foundRouteDto: FoundRouteDto[]) {
    return this.travelService.createFoundRoute(foundRouteDto);
  }
}