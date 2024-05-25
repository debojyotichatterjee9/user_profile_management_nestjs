import { IsString } from 'class-validator';

export class AvatarDto {
  @IsString()
  large?: string;

  @IsString()
  medium?: string;

  @IsString()
  small?: string;

  @IsString()
  thumbnail?: string;
}
