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

  @IsOptional()
  @IsBoolean()
  is_super_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
