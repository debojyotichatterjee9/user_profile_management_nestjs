import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Ip,
  NotAcceptableException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/request.dtos/login.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LoginResponseDto } from './dto/response.dtos/authenticate.login.response.dto';
import { AuthenticateResponseDto } from './dto/response.dtos/authenticate.response.dto';
import { RefreshLoginResponseDto } from './dto/response.dtos/authenticate.refresh.response.dto';
import { LogoutResponseDto } from './dto/response.dtos/authenticate.logout.response.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Serialize(LoginResponseDto)
  @Post('login')
  login(
    @Ip() ip: string,
    @Headers() headers: any,
    @Body() payload: LoginDto,
    @Session() session: any,
  ) {
    return this.authenticationService.login(ip, headers, payload, session);
  }

  @UseGuards(AuthGuard)
  @Serialize(RefreshLoginResponseDto)
  @Get('refresh')
  getRefresheToken(
    @Ip() ip: string,
    @Headers() headers: any,
    @Session() session: any,
  ) {
    const refreshToken = headers.authentication;
    if (!refreshToken) {
      throw new NotAcceptableException('This is not a valid call.');
    }
    return this.authenticationService.refreshToken(
      refreshToken,
      ip,
      headers,
      session,
    );
  }

  @UseGuards(AuthGuard)
  @Serialize(AuthenticateResponseDto)
  @Get()
  authenticate(@Headers() headers: any) {
    const token = headers.authentication;
    if (!token) {
      throw new NotAcceptableException('This is not a valid call.');
    }
    return this.authenticationService.authenticate(token);
  }

  @Serialize(LogoutResponseDto)
  @Delete('logout')
  logout(@Headers() headers: any) {
    const token = headers.authentication;
    if (!token) {
      throw new NotAcceptableException('This is not a valid call.');
    }
    return this.authenticationService.logout(token);
  }
}
