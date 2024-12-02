import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MetaData } from './entities/user.metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MetaData])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
