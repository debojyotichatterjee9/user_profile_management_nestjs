import { IsOptional, IsString } from 'class-validator';

export class AvatarDto {
  @IsOptional()
  @IsString()
  large?: string;

  @IsOptional()
  @IsString()
  medium?: string;

  @IsOptional()
  @IsString()
  small?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
