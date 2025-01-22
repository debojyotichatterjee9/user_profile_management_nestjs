import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/request.dtos/login.dto';
import { authenticationDto } from './dto/request.dtos/authenticate.dto';

@Injectable()
export class AuthenticationService {
  login(loginDto: LoginDto) {
    return `This action is login`;
  }

  logout(token: string) {
    return `This action is logout`;
  }

  authenticate(token: string) {
    return `This action is logout`;
  }
}
