import { IsBoolean, IsObject, IsString } from 'class-validator';
import { LocationDto } from './user.address.location.dto';
import { TimezoneDto } from './user.address.timezone.dto';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  type?: string;

  @IsString()
  label?: string;

  @IsString()
  address?: string;

  @IsString()
  city?: string;

  @IsString()
  state?: string;

  @IsString()
  country?: string;

  @IsString()
  country_code?: string;

  @IsString()
  zipcode?: string;

  @IsObject()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsObject()
  @Type(() => TimezoneDto)
  timezone?: TimezoneDto;

  @IsBoolean()
  is_default?: boolean;
}
