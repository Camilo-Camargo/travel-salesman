import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TravelService } from './services/travel.service';
import { TravelGateway } from './travel.gateway';
import { TravelController } from './controller/travel.controller';


@Module({
  controllers: [TravelController],
  providers: [TravelService, TravelGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
