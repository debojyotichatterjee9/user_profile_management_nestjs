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
import { OrganizationService } from 'src/organization/organization.service';

@Injectable()
export class OrganizationTasksService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly randomDataProvider: RandomDataProvider,
    private readonly organizationService: OrganizationService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'ADD_RANDOM_ORGANIZATION_TASK',
    disabled: false, // TODO: make this part dynamic later
  })
  async addRandomUserTask() {
    try {
      const environment = this.configService.get('environment');
      if (environment === 'development') {
        loggernaut.info('Running: ADD_RANDOM_ORGANIZATION_TASK');
        const randomDummyOrganization =
          this.randomDataProvider.generaterandomDummyOrganizationData();
          console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
          loggernaut.debug(randomDummyOrganization)
          console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
        const existingOrganization = await this.userRepository
          .createQueryBuilder('organization')
          .where('organization.email = :email', {
            email: randomDummyOrganization.contact_email,
          })
          .getOne();
        if (!existingOrganization) {
          const insertedOrg =
            await this.organizationService.create(randomDummyOrganization);
          loggernaut.info(`Organization Inserted --> ${insertedOrg.id}`);
        } else {
          loggernaut.warn(
            `Skipping Organization insertion as the contact email already exists.`,
          );
        }
      } else {
        loggernaut.info(`Scheduled Tasks Disabled in ${environment} environment.`);
      }
    } catch (error) {
      loggernaut.error(error.message);
    }
  }
}
