import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TravelService } from './services/travel.service';
import { CreateTravelMiddleware } from './middleware/travel.middleware';
import { CreateFoundRouteMiddleware } from './middleware/travel.middleware';


@Module({
  providers: [TravelService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CreateTravelMiddleware)
      .forRoutes({ path: 'travel/find', method: RequestMethod.POST });
    consumer
      .apply(CreateFoundRouteMiddleware)
      .forRoutes({ path: 'travel/found-route', method: RequestMethod.POST });
    
  }
}
