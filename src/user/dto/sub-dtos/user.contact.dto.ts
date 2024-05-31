import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class ContactDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  country_code?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsBoolean()
  is_default?: boolean;
}
