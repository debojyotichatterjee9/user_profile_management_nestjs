import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from './entities/authentication.entity';
import { UserModule } from 'src/user/user.module';
import { PasetoProvider } from 'src/utilProviders/paseto.util.provider';
import { AdminModule } from 'src/admin/admin.module';
import { RolesService } from 'src/admin/services/admin.role.service';
import { OrganizationService } from '../organization/organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authentication]), UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, OrganizationService,RolesService, PasetoProvider],
  exports: [AuthenticationService, TypeOrmModule, PasetoProvider],
})
export class AuthenticationModule {}
