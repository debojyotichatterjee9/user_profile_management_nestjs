import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Address } from '../user/entities/user.address.entity';
import { Authentication } from '../user/entities/user.authentication.entity';
import { Avatar } from '../user/entities/user.avatar.entity';
import { Contact } from '../user/entities/user.contact.entity';
import { User } from '../user/entities/user.entity';
import { Identification } from '../user/entities/user.identification.entity';
import { Location } from '../user/entities/user.location.entity';
import { MetaData } from '../user/entities/user.metadata.entity';
import { Name } from '../user/entities/user.name.entity';
import { SocialProfile } from '../user/entities/user.social.entity';
import { Timezone } from '../user/entities/user.timezone.entity';
import { UserModule } from '../user/user.module';
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
        Name,
        Authentication,
        Identification,
        Location,
        Timezone,
        Address,
        Contact,
        SocialProfile,
        Avatar,
        MetaData,
        User,
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
