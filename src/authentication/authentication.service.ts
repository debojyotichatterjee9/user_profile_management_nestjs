import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/request.dtos/login.dto';
import loggernaut from 'loggernaut';
import { InjectRepository } from '@nestjs/typeorm';
import { Authentication } from './entities/authentication.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PasetoProvider } from 'src/utilProviders/paseto.util.provider';
import { ConfigService } from '@nestjs/config';

const { V3 } = require('paseto');

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Authentication)
    private readonly authRepository: Repository<Authentication>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly pasetoProvider: PasetoProvider,
  ) {}
  async login(ip: string, headers: any, payload: LoginDto, session: any) {
    try {
      if (!payload.email && !payload.username) {
        throw new BadRequestException('Please provide a email or username.');
      }
      const [userIdentity, password] = [
        payload.email ? payload.email : payload.username,
        payload.password,
      ];
      const userInfo = await this.userService.findUserByIdentity(userIdentity);
      if (!userInfo) {
        throw new NotFoundException(
          'User with the email/username does not exist',
        );
      }
      const passwordValidFlag = userInfo.validatePassword(password);
      if (!passwordValidFlag) {
        throw new BadRequestException('The password provided is invalid.');
      }
      const [userAgent] = [headers['user-agent']];
      const tokenInfo = this.generateUserAuthTokenPair(userInfo, userAgent, ip);
      return tokenInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(
    refreshToken: string,
    ip: string,
    headers: any,
    session: any,
  ) {
    console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
    console.log("Coming here")
    try {
      const refreshTokenInfo = await this.authRepository.findOneOrFail({
        where: {
          refresh_token: refreshToken,
        },
      });
      if (refreshTokenInfo.refresh_token_expired) {
        throw new BadRequestException(
          'The refresh token provided is already expired.',
        );
      }
      const decodedRefreshTokenInfo: any =
        await this.pasetoProvider.decodeEncryptedToken(
          refreshToken,
          refreshTokenInfo.key,
        );
      if (!decodedRefreshTokenInfo) {
        throw new BadRequestException('Invalid token.');
      }
      const userIdentity: string = decodedRefreshTokenInfo.sub;
      const userInfo = await this.userService.findUserByIdentity(userIdentity);
      if (!userInfo) {
        throw new NotFoundException(
          'User associated with this token does not exist',
        );
      }
      // Update the expired flag for the refresh token and save.
      const updatedRefreshToken = this.authRepository.merge(refreshTokenInfo, {
        refresh_token_expired: true,
      });

      const updatedRefreshTokenInfo =
        await this.authRepository.save(updatedRefreshToken);
      if (updatedRefreshTokenInfo) {
        const [userAgent] = [headers['user-agent']];
        const tokenInfo = await this.generateUserAuthTokenPair(
          userInfo,
          userAgent,
          ip,
        );
        return tokenInfo;
      }
      throw new BadRequestException('This action cannot be performed.');
    } catch (error) {
      console.log(error);
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async authenticate(token: string) {
    try {
      const tokenInfo = await this.authRepository.findOne({
        where: {
          token: token,
        },
      });
      if (!tokenInfo) {
        // If token exists in any case the force expire the token
        await this.logout(token);
        throw new UnauthorizedException('This is a invalid token.');
      }
      if (tokenInfo.token_expired || tokenInfo.refresh_token_expired) {
        await this.logout(token);
        throw new UnauthorizedException(
          'The token provided is already expired.',
        );
      }
      const decodedTokenInfo: any =
        await this.pasetoProvider.decodeEncryptedToken(token, tokenInfo.key);
      const userInfo = await this.userService.findUserByIdentity(
        decodedTokenInfo.user_id,
      );
      if (!userInfo) {
        // If token exists in any case the force expire the token
        await this.logout(token);
        throw new UnauthorizedException(
          'No user has been assigned this token.',
        );
      }
      return userInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async generateUserAuthTokenPair(
    userInfo: any,
    userAgent: string,
    ip: string,
  ) {
    const PASETO_LOCAL_KEY = await this.pasetoProvider.generatePaserkLocalKey();
    const pasetoPayload = {
      user_id: userInfo.id,
      name: `${userInfo.first_name} ${userInfo.last_name}`,
      user_email: userInfo.email,
      username: userInfo.username,
    };
    const token = await this.pasetoProvider.generateEncryptedToken(
      pasetoPayload,
      PASETO_LOCAL_KEY,
    );
    const refreshTokenFlag = this.configService.get('refresh_token_flag');

    const refreshToken = await this.pasetoProvider.generateEncryptedToken(
      pasetoPayload,
      PASETO_LOCAL_KEY,
      refreshTokenFlag,
    );

    const tokenObj = new Authentication();
    tokenObj.key = PASETO_LOCAL_KEY;
    tokenObj.token = token;
    tokenObj.refresh_token = refreshToken;
    tokenObj.user_id = userInfo.id;
    tokenObj.user_email = userInfo.email;
    tokenObj.user_agent = userAgent;
    tokenObj.ip = ip;
    const tokenInfo = await this.authRepository.save(tokenObj);

    return tokenInfo;
  }

  async logout(token: string) {
    try {
      const tokenInfo = await this.authRepository.findOneOrFail({
        where: {
          token: token,
        },
      });
      if (!token) {
        throw new UnauthorizedException('This is a invalid token.');
      }
      if (tokenInfo.token_expired || tokenInfo.refresh_token_expired) {
        throw new UnauthorizedException(
          'The token provided is already expired.',
        );
      }
      // Invalidate the found token
      const updatedToken = this.authRepository.merge(tokenInfo, {
        token_expired: true,
        refresh_token_expired: true,
      });

      // Save the updated token
      return await this.authRepository.save(updatedToken);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(
        'Something went wrong, please try again later.',
      );
    }
  }
}
