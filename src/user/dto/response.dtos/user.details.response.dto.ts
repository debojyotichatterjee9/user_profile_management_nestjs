import { Expose, Type } from 'class-transformer';

// TODO: Move the sub dtos to different files and import
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
  is_default: boolean;
}

class ContactDto {
  @Expose()
  type: string;
  @Expose()
  label: string;
  @Expose()
  country_code: string;
  @Expose()
  number: string;
  @Expose()
  is_default: boolean;
  @Expose()
  value: string;
}

class MetaDataDto {
  @Expose()
  gender: string;
  @Expose()
  dob: string;
  @Expose()
  theme_code: string;
  @Expose()
  is_super_admin: boolean;
  @Expose()
  is_enabled: boolean;
  @Expose()
  is_activated: boolean;
  @Expose()
  is_deleted: boolean;
  @Expose()
  enabled_on: string;
  @Expose()
  disabled_on: string;
  @Expose()
  activated_on: string;
  @Expose()
  deleted_on: string;
}

class SocialProfilesDto {
  @Expose()
  label: string;
  @Expose()
  link: string;
}
class OrganizationDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  logo: string;
}
class PermissionDto {
  @Expose()
  name: string;
  @Expose()
  is_enabled: boolean;
}
class RoleDto {
  @Expose()
  name: string;
  @Expose()
  is_enabled: boolean;

  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
export class UserDetailsResponsetDto {
  @Expose()
  id: string;
  @Expose()
  first_name: string;
  @Expose()
  middle_name: string;
  @Expose()
  last_name: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
  // @Expose()
  // organization_id: string;
  @Expose()
  @Type(() => Date)
  created_on: Date;
  @Expose()
  @Type(() => Date)
  updated_on: Date;
  @Expose()
  @Type(() => IdentificationDto)
  identification?: IdentificationDto[];
  @Expose()
  @Type(() => AddressDto)
  address: AddressDto[];
  @Expose()
  @Type(() => ContactDto)
  contact: ContactDto[];
  @Expose()
  @Type(() => SocialProfilesDto)
  social_profiles: SocialProfilesDto[];
  @Expose()
  @Type(() => MetaDataDto)
  meta_data: MetaDataDto;
  @Expose()
  @Type(() => OrganizationDto)
  organization: OrganizationDto;
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
