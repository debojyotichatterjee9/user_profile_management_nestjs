import { Body, Controller, Delete, Get, Headers, Ip, NotAcceptableException, Post, Session, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/request.dtos/login.dto';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Ip() ip: string, @Headers() headers: any, @Body() payload: LoginDto, @Session() session: any) {
    return this.authenticationService.login(ip, headers, payload, session);
  }

  @Get()
  authenticate(@Headers() headers: any) {
    const token = headers.authentication;
    if(!token) {
      throw new NotAcceptableException("This is not a valid call.")
    }
    return this.authenticationService.authenticate(token);
  }

  @Delete('logout')
  logout(@Headers() headers: any) {
    const token = headers.authentication;
    if(!token) {
      throw new NotAcceptableException("This is not a valid call.")
    }
    return this.authenticationService.logout(token);
  }
}
