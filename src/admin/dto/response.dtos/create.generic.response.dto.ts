import { Expose } from 'class-transformer';

export class CreateGenericResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
