import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { Authentication } from 'src/authentication/entities/authentication.entity';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { PasetoProvider } from 'src/utilProviders/paseto.util.provider';
import { Role } from '../admin/entities/role.entity';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from '../organization/entities/organization.entity';
import { AdminModule } from 'src/admin/admin.module';
import { RolesService } from 'src/admin/services/admin.role.service';
import { Permission } from 'src/admin/entities/permission.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Organization, Role, Permission, Authentication]),
    UserModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    OrganizationService,
    AuthenticationService,
    RolesService,
    PasetoProvider,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
