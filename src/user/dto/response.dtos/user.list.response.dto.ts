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
class UserListDto {
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
  @Expose()
  organization_id: string;
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
}
export class UserListResponseDto {
  @Expose({ name: 'totalCount' })
  total_count?: number;

  @Expose({ name: 'filterCount' })
  filter_count?: number;

  @Expose({ name: 'userList' })
  @Type(() => UserListDto)
  user_list?: UserListDto[];
}
