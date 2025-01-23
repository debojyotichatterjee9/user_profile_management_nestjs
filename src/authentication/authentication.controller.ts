import { Body, Controller, Get, Headers, NotAcceptableException, Post, Session, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/request.dtos/login.dto';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() payload: LoginDto, @Session() session: any) {
    return this.authenticationService.login(payload, session);
  }

  @Get()
  authenticate(@Headers() headers: any) {
    console.log('>> ################################################## <<');
    console.log(headers)
    console.log('>> ################################################## <<');
    const token = headers.authentication;
    if(!token) {
      throw new NotAcceptableException("This is not a valid call.")
    }
    return this.authenticationService.authenticate(token);
  }

  @Post('logout')
  logout(token: string) {
    return this.authenticationService.logout(token);
  }
}
