import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from './entities/authentication.entity';
import { UserModule } from 'src/user/user.module';
import { PasetoProvider } from 'src/utilProviders/paseto.util.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Authentication]), UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PasetoProvider],
})
export class AuthenticationModule {}
