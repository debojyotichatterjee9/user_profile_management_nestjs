import { Expose, Type } from 'class-transformer';

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
export class AuthenticateResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  first_name: string;
  @Expose()
  middle_name: string;
  @Expose()
  last_name: string;
  @Expose()
  avatar: string;
  @Expose()
  organization_id: string;
  @Expose()
  @Type(() => MetaDataDto)
  meta_data: MetaDataDto;
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
