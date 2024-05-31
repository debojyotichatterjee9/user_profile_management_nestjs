import { IsOptional, IsString } from 'class-validator';

export class NameDto {
  @IsOptional()
  @IsString()
  name_prefix: string;

  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  name_suffix: string;
}
