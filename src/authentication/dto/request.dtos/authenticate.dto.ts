import { IsOptional, IsString } from 'class-validator';
export class AuthenticationDto {
  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsOptional()
  user_agent: string;
}
