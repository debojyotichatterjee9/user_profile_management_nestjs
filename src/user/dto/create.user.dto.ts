import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { NameDto } from './sub-dtos/user.name.dto';
import { AuthenticationDto } from './sub-dtos/user.authentication.dto';
import { Type } from 'class-transformer';
import { IdentificationDto } from './sub-dtos/user.identification.dto';
import { Address } from '../entities/user.address.entity';
import { ContactDto } from './sub-dtos/user.contact.dto';
import { SocialProfile } from '../entities/user.social.entity';
import { AvatarDto } from './sub-dtos/user.avatar.dto';
import { SocialProfileDto } from './sub-dtos/user.social.dto';
import { MetaDataDto } from './sub-dtos/user.metadata.dto';
import { AddressDto } from './sub-dtos/user.address.dto';

export class CreateUserDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NameDto)
  name?: NameDto;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  username?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentificationDto)
  identification?: IdentificationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address?: AddressDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contact?: ContactDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialProfileDto)
  social_profiles?: SocialProfileDto[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AvatarDto)
  avatar?: AvatarDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => MetaDataDto)
  meta_data?: MetaDataDto;
}
