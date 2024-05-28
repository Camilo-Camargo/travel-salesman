export class LocationDto {
  name: string;
  lat: number;
  lng: number;
}

export class FoundRouteDto {
  from: LocationDto;
  to: LocationDto;
  distance: number;
  price: number;
}