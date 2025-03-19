import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import loggernaut from 'loggernaut';
import { faker } from '@faker-js/faker';
import { RandomDataProvider } from 'src/utilProviders/randomData.util.provider';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserTasksService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly randomDataProvider: RandomDataProvider,
    private readonly userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'ADD_RANDOM_USER_TASK',
    disabled: false, // TODO: make this part dynamic later
  })
  async addRandomUserTask() {
    const environment = this.configService.get('environment');
    if (environment === 'development') {
      loggernaut.info('Running: ADD_RANDOM_USER_TASK');
      const randomDummyUser =
        this.randomDataProvider.generaterandomDummyUserData();
      const existingUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email OR user.username = :username', {
          email: randomDummyUser.email,
          username: randomDummyUser.username,
        })
        .getOne();
      if (!existingUser) {
        const insertedUser = await this.userService.createUser(randomDummyUser);
        loggernaut.info(`User Inserted --> ${insertedUser.id}`);
      }
    } else {
      loggernaut.info('Scheduled Tasks Disabled in this environment.');
    }
  }
}
