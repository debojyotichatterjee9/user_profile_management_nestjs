import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  // @Min(1)
  page: string;

  @IsString()
  // @Min(1)
  limit: string;
}
