import { IsOptional, IsString } from 'class-validator';

export class IdentificationDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  value?: string;
}
