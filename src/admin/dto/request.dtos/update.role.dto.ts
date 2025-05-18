import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  permission_ids?: string[];

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
