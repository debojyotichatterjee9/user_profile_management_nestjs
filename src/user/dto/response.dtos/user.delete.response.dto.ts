import { Expose } from 'class-transformer';

export class DeleteUserResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
