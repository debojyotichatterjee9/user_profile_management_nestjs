import { IsBoolean, IsString } from 'class-validator';

export class ContactDto {
  @IsString()
  type?: string;

  @IsString()
  label?: string;

  @IsString()
  country_code?: string;

  @IsString()
  number?: string;

  @IsBoolean()
  is_default?: boolean;
}
