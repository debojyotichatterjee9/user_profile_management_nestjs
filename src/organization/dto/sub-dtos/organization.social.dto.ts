import { IsOptional, IsString } from 'class-validator';

export class SocialProfileDto {
  @IsOptional()
  @IsString()
  label?: string;


  @IsOptional()
  @IsString()
  link?: string;
}
