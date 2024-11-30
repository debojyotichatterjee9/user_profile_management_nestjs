import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class RegisterUserDto {
  @IsString()
  name_prefix: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsString()
  middle_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsString()
  name_suffix: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
