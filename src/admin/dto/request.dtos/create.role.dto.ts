import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  organization_id: string;

  @IsArray()
  permission_ids?: string[];

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
