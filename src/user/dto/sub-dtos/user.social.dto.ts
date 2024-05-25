import { IsString } from 'class-validator';

export class SocialProfileDto {
  @IsString()
  label?: string;

  @IsString()
  link?: string;
}
