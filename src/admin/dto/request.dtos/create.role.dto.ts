import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  permission_ids?: string[];

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}
