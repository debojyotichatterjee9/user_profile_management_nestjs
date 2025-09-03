import { Expose } from 'class-transformer';

export class UpdateUserResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
