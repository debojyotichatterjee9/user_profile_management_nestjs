import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
  @Expose({ name: 'id' })
  id?: string;
}
