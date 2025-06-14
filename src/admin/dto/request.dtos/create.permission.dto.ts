import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_enabled?: boolean;
}

export class CreatePermissionBulkDto {
  @IsArray()
  permissions: CreatePermissionDto[];
}