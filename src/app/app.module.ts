import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'src/user/entities/user.contact.entity';
import { Identification } from 'src/user/entities/user.identification.entity';
import { SocialProfile } from 'src/user/entities/user.social.entity';
import { Address } from '../user/entities/user.address.entity';
import { User } from '../user/entities/user.entity';
import { MetaData } from '../user/entities/user.metadata.entity';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrgAddress } from 'src/organization/entities/organization.address.entity';
import { OrgContact } from 'src/organization/entities/organization.contact.entity';
import { OrgSocialProfile } from 'src/organization/entities/organization.social.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { Authentication } from 'src/authentication/entities/authentication.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { UserTasksService } from 'src/admin/scheduledTasks/user.task.service';
import { AdminModule } from 'src/admin/admin.module';
import { OrganizationTasksService } from 'src/admin/scheduledTasks/organization.task.service';
import { Permission } from 'src/admin/entities/permission.entity';
import { Role } from 'src/admin/entities/role.entity';
import { Admin } from 'typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'usr_mgmt_nest',
      cache: {
        duration: 30000, // keeping cache 30 seconds
      },
      synchronize: true,
      logging: true,
      entities: [
        Admin,
        Permission,
        Role,
        Authentication,
        User,
        Address,
        Contact,
        Identification,
        SocialProfile,
        MetaData,
        Organization,
        OrgAddress,
        OrgContact,
        OrgSocialProfile,
      ],
      subscribers: [],
      migrations: [],
    }),
    AdminModule,
    AuthenticationModule,
    UserModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[]
})
export class AppModule {}
