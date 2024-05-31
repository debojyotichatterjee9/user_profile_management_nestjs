import { IsOptional, IsString } from 'class-validator';

export class LocationDto {

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;
}
