import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './sub-dtos/user.address.dto';
import { AuthenticationDto } from './sub-dtos/user.authentication.dto';
import { AvatarDto } from './sub-dtos/user.avatar.dto';
import { ContactDto } from './sub-dtos/user.contact.dto';
import { IdentificationDto } from './sub-dtos/user.identification.dto';
import { MetaDataDto } from './sub-dtos/user.metadata.dto';
import { NameDto } from './sub-dtos/user.name.dto';
import { SocialProfileDto } from './sub-dtos/user.social.dto';

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

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto;

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
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AvatarDto)
  avatar?: AvatarDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => MetaDataDto)
  meta_data?: MetaDataDto;
}
