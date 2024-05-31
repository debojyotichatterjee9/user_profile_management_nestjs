import { IsOptional, IsString } from 'class-validator';

export class TimezoneDto {
  @IsOptional()
  @IsString()
  offset?: string;

  @IsOptional()
  @IsString()
  zone?: string;
}
