import { Expose, Type } from 'class-transformer';

// TODO: Move the sub dtos to different files and import
class SocialProfileDto {
  @Expose()
  label: string;
  @Expose()
  link: string;
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
  latitude: string;
  @Expose()
  longitude: string;
  @Expose()
  offset: string;
  @Expose()
  zone: string;
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
}
class OrganizationListDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  contact_email: string;
  @Expose()
  logo: string;
  @Expose()
  is_enabled: boolean;
  @Expose()
  is_deleted: boolean;
  @Expose()
  enabled_on: string;
  @Expose()
  @Type(() => Date)
  disabled_on: Date;
  @Expose()
  @Type(() => Date)
  deleted_on: Date;
  @Expose()
  @Type(() => AddressDto)
  address: AddressDto[];
  @Expose()
  @Type(() => ContactDto)
  contact: ContactDto[];
  @Expose()
  @Type(() => SocialProfileDto)
  social_profiles?: SocialProfileDto[];
}
export class OrganizationListResponseDto {
  @Expose({ name: 'totalCount' })
  total_count?: number;

  @Expose({ name: 'filterCount' })
  filter_count?: number;

  @Expose({ name: 'organizationList' })
  @Type(() => OrganizationListDto)
  organization_list?: OrganizationListDto[];
}
