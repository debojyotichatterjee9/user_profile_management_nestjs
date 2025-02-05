import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @Expose({ name: 'user_id' })
  id: string;
  @Expose()
  token: string;
  @Expose()
  refresh_token: string;
  @Expose()
  created_on: string;
}
