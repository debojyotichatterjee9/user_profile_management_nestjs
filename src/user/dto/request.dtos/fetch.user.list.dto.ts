import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  // @Min(1)
  page?: string;

  @IsOptional()
  @IsString()
  // @Min(1)
  limit?: string;
}
