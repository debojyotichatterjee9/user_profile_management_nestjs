import { IsBoolean, IsString } from 'class-validator';

export class MetaDataDto {
  @IsString()
  gender?: string;

  @IsString()
  dob?: string;

  @IsString()
  theme_code?: string;

  @IsBoolean()
  is_super_admin?: boolean;
}
