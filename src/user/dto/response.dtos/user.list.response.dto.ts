import { Expose, Type } from 'class-transformer';

// TODO: Move the sub dtos to different files and import
class NameDto {
  @Expose()
  name_prefix: string;
  @Expose()
  first_name: string;
  @Expose()
  middle_name: string;
  @Expose()
  last_name: string;
  @Expose()
  name_suffix: string;
}
class IdentificationDto {
  @Expose()
  type: string;
  @Expose()
  value: string;
}
class AddressDto {
  @Expose()
  type: string;
  @Expose()
  label: string;
  @Expose()
  address: string;
  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  country: string;
  @Expose()
  country_code: string;
  @Expose()
  zipcode: string;
  @Expose()
  is_default: string;
}
class UserListInterDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  organization_id: string;
  @Expose()
  created_on: string;
  @Expose()
  updated_on: string;
  @Expose()
  @Type(() => NameDto)
  name: NameDto;
  @Expose()
  @Type(() => IdentificationDto)
  identification?: IdentificationDto[];
  @Expose()
  @Type(() => AddressDto)
  address: AddressDto[];
}
export class UserListResponseDto {
  @Expose({ name: 'totalCount' })
  total_count?: number;

  @Expose({ name: 'filterCount' })
  filter_count?: number;

  @Expose({ name: 'userList' })
  @Type(() => UserListInterDto)
  user_list?: UserListInterDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => AddressDto)
  // address?: AddressDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ContactDto)
  // contact?: ContactDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => SocialProfileDto)
  // social_profiles?: SocialProfileDto[];

  // @IsOptional()
  // @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => AvatarDto)
  // avatar?: AvatarDto;

  // @IsOptional()
  // @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => MetaDataDto)
  // meta_data?: MetaDataDto;
}
