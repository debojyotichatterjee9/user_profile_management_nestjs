import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;
}
