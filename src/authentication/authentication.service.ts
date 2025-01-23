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
const { V3 } = require('paseto');

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Authentication)
    private readonly authRepository: Repository<Authentication>,
    private readonly userService: UserService,
    private readonly pasetoProvider: PasetoProvider,
  ) {}
  async login(payload: LoginDto, session: any) {
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
      const PASETO_LOCAL_KEY =
        await this.pasetoProvider.generatePaserkLocalKey();
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

      const tokenObj = new Authentication();
      tokenObj.key = PASETO_LOCAL_KEY;
      tokenObj.token = token;
      tokenObj.user_id = userInfo.id;
      tokenObj.user_email = userInfo.email;
      tokenObj.user_agent = 'TBD';
      tokenObj.ip = 'TBD';
      // const user = this.authRepository.create(tokenObj);
      const tokenInfo = await this.authRepository.save(tokenObj);

      return tokenInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  logout(token: string) {
    return `This action is logout`;
  }

  async authenticate(token: string) {
    try {
      const tokenInfo = await this.authRepository.findOneOrFail({
        where: {
          token: token,
        },
      });
      if (!token) {
        throw new UnauthorizedException('This is a invalid token.');
      }
      const decodedTokenInfo: any =
        await this.pasetoProvider.decodeEncryptedToken(token, tokenInfo.key);
      const userInfo = await this.userService.findUserByIdentity(
        decodedTokenInfo.user_id,
      );
      if (!userInfo) {
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
}
