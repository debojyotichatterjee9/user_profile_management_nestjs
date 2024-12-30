import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrganizationDto } from './create.organization.dto';
import { AddressDto } from '../sub-dtos/organization.address.dto';
import { ContactDto } from '../sub-dtos/organization.contact.dto';
import { SocialProfileDto } from '../sub-dtos/organization.social.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  contact_email?: string;

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
  logo?: string;

  @IsOptional()
  is_enabled?: boolean;

  @IsOptional()
  is_deleted?: boolean;

  @IsOptional()
  enabled_on: Date;

  @IsOptional()
  deleted_on: Date;
}
