import { IsString } from 'class-validator';

export class TimezoneDto {
  @IsString()
  offset?: string;
  zone?: string;
}
