import { IsBoolean, IsObject, IsString, IsOptional } from 'class-validator';
import { LocationDto } from './user.address.location.dto';
import { TimezoneDto } from './user.address.timezone.dto';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  country_code?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @IsObject()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsObject()
  @Type(() => TimezoneDto)
  timezone?: TimezoneDto;

  @IsBoolean()
  is_default?: boolean;
}
