import { Expose } from 'class-transformer';

export class GenericCreateUpdateDeleteResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
