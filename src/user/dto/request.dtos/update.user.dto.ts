import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { AddressDto } from '../sub-dtos/user.address.dto';
import { ContactDto } from '../sub-dtos/user.contact.dto';
import { IdentificationDto } from '../sub-dtos/user.identification.dto';
import { MetaDataDto } from '../sub-dtos/user.metadata.dto';
import { SocialProfileDto } from '../sub-dtos/user.social.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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

  @IsString()
  @IsEmail()
  role_id?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentificationDto)
  identification?: IdentificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address?: AddressDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contact?: ContactDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialProfileDto)
  social_profiles?: SocialProfileDto[];

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => MetaDataDto)
  meta_data?: MetaDataDto;
}
