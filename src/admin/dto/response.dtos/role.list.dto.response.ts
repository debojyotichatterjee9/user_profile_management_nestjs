import { Expose, Type } from 'class-transformer';

class RoleListDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}

export class RoleListResponseDto {
  @Expose({ name: 'totalCount' })
  total_count?: number;

  @Expose({ name: 'filterCount' })
  filter_count?: number;

  @Expose({ name: 'roleList' })
  @Type(() => RoleListDto)
  role_list?: RoleListDto[];
}
