import { Expose } from 'class-transformer';

export class LogoutResponseDto {
  @Expose({ name: 'user_id' })
  id: string;
}