import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MetaDataDto {
  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  theme_code?: string;

  @IsBoolean()
  is_super_admin?: boolean;
}
