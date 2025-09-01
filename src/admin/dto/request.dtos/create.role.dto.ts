import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  permission_ids?: string[];

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
