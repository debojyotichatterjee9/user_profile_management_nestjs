import { Expose, Type } from 'class-transformer';

class PermissionListDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
export class PermissionListResponseDto {
  @Expose({ name: 'totalCount' })
  total_count?: number;

  @Expose({ name: 'filterCount' })
  filter_count?: number;

  @Expose({ name: 'permissionList' })
  @Type(() => PermissionListDto)
  permission_list?: PermissionListDto[];
}
