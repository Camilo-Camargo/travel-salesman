import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TravelService } from 'src/services/travel.service';

@Injectable()
export class CreateTravelMiddleware implements NestMiddleware {
  constructor(private readonly travelService: TravelService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const { from, to, fuelCost } = req.body;
    const travel = this.travelService.createTravel({ from, to, fuelCost });
    res.status(201).json(travel);
  }
}


@Injectable()
export class CreateFoundRouteMiddleware implements NestMiddleware {
  constructor(private readonly travelService: TravelService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const routes = req.body;
    const createdRoutes = routes.map(route => this.travelService.createFoundRoute(route));
    res.status(201).json(createdRoutes);
  }
}