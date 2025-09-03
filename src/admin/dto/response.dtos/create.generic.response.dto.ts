import { Expose, Type } from 'class-transformer';

export class CreateGenericResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'name' })
  name?: string;
}

export class CreateGenericBulkResponseDto<T = CreateGenericResponseDto> {
  @Expose({ name: 'data' })
  @Type((): typeof CreateGenericResponseDto => CreateGenericResponseDto)
  data: T[];

  constructor(partial: Partial<CreateGenericBulkResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
