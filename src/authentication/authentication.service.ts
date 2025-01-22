import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/request.dtos/login.dto';
import { authenticationDto } from './dto/request.dtos/authenticate.dto';
import loggernaut from 'loggernaut';

@Injectable()
export class AuthenticationService {
  login(loginDto: LoginDto) {
    try {
      if (!loginDto.email && !loginDto.username) {
        throw new BadRequestException('Please provide a email or username.');
      }
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  logout(token: string) {
    return `This action is logout`;
  }

  authenticate(token: string) {
    return `This action is logout`;
  }
}
