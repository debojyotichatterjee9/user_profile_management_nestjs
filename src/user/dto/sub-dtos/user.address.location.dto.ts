import { IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  latitude?: string;
  longitude?: string;
}
