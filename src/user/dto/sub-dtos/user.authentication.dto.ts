import { IsString } from 'class-validator';

export class AuthenticationDto {
  @IsString()
  password?: string;
}
