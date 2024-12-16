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
@Module({
  imports: [
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
