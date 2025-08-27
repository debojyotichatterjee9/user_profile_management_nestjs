import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import loggernaut from 'loggernaut';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Authentication } from 'src/authentication/entities/authentication.entity';
import { UserService } from 'src/user/user.service';
import { PasetoProvider } from 'src/utilProviders/paseto.util.provider';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { PUBLIC_API_KEY } from '../config/generic.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Authentication)
    private readonly authRepository: Repository<Authentication>,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly pasetoProvider: PasetoProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicApi = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_API_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicApi) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authentication?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const tokenInfo = await this.authRepository.findOne({ where: { token } });

      if (
        !tokenInfo ||
        tokenInfo.token_expired ||
        tokenInfo.refresh_token_expired
      ) {
        await this.authenticationService.logout(token);
        throw new Error(tokenInfo ? 'Token expired' : 'Invalid token');
      }

      const decodedToken = await this.pasetoProvider.decodeEncryptedToken(
        token,
        tokenInfo.key,
      );
      const user = await this.userService.findUserByIdentity(
        decodedToken.user_id,
      );

      if (!user) {
        await this.authenticationService.logout(token);
        throw new Error('No user associated with this token');
      }

      request.user = user;
      return true;
    } catch (error) {
      loggernaut.error(error.message);
      throw new UnauthorizedException(error.message);
    }
  }
}
