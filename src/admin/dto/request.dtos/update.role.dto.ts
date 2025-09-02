import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsString()
  organization_id: string;

  @IsOptional()
  @IsArray()
  permission_ids?: string[];

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
