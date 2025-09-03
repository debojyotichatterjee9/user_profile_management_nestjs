import { Expose } from 'class-transformer';

export class RefreshLoginResponseDto {
  @Expose()
  token: string;
  @Expose()
  refresh_token: string;
  @Expose()
  created_on: string;
}
