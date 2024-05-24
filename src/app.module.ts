import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Name } from './user/entities/user.name.entity';
import { Authentication } from './user/entities/user.authentication.entity';
import { Identification } from './user/entities/user.identification.entity';
import { Timezone } from './user/entities/user.timezone.entity';
import { Address } from './user/entities/user.address.entity';
import { Contact } from './user/entities/user.contact.entity';
import { SocialProfile } from './user/entities/user.social.entity';
import { Avatar } from './user/entities/user.avatar.entity';
import { MetaData } from './user/entities/user.metadata.entity';
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
