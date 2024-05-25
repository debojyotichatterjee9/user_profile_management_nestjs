import { IsString } from 'class-validator';

export class IdentificationDto {
  @IsString()
  type?: string;

  @IsString()
  value?: string;
}
