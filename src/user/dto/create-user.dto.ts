import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsObject,
  ValidateNested,
} from 'class-validator';

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
export class CreateUserDto {
  @IsObject()
  @ValidateNested()
  name: NameDto;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  username?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;
}
