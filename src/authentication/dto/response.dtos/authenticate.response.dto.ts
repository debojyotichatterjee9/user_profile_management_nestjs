import { Expose } from 'class-transformer';

export class AuthenticateResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  first_name: string;
  @Expose()
  middle_name: string;
  @Expose()
  last_name: string;
  @Expose()
  avatar: string;
  @Expose()
  organization_id: string;
}
