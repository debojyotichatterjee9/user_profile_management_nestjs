import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import loggernaut from 'loggernaut';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserTasksService {
  private readonly logger = new Logger(UserTasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'ADD_RANDOM_USER_TASK',
  })
  addRandomUserTask() {
    loggernaut.info('Running: ADD_RANDOM_USER_TASK');
    const dummyUser = {
      name_prefix: faker.person.prefix(),
      first_name: faker.person.firstName(),
      middle_name: faker.person.middleName(),
      last_name: faker.person.lastName(),
      name_suffix: faker.person.suffix(),
      email: faker.internet.email(),
      username: faker.internet.username(),
      organization_id: '00000000-0000-0000-0000-000000000000',
      password: 'Demo@12345',
      identification: [
        {
          type: 'SSN',
          value: faker.phone.imei(),
        },
      ],
      address: [
        {
          type: 'PRIMARY',
          label: 'Home',
          address: faker.location.streetAddress({ useFullAddress: true }),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          country_code: faker.location.countryCode('alpha-2'),
          zipcode: faker.location.zipCode('#####') ,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          offset: '+9:30',
          zone: faker.location.timeZone(),
          is_default: true,
        },
        {
          type: 'SECONDARY',
          label: 'Apartment',
          address: faker.location.streetAddress({ useFullAddress: true }),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          country_code: faker.location.countryCode('alpha-2'),
          zipcode: faker.location.zipCode('#####') ,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          offset: '+9:30',
          zone: faker.location.timeZone(),
          is_default: false,
        },
      ],
      contact: [
        {
          type: 'PRIMARY',
          label: 'Home',
          country_code: `+${faker.location.countryCode('numeric')}`,
          number: faker.phone.number({ style: 'national' }),
          is_default: true,
        },
        {
          type: 'SECONDARY',
          label: 'Apartment',
          country_code: `+${faker.location.countryCode('numeric')}`,
          number: faker.phone.number({ style: 'national' }),
          is_default: false,
        },
      ],
      social_profiles: [
        {
          label: 'Facebook',
          link: faker.internet.url(),
        },
        {
          label: 'Instagram',
          link: faker.internet.url(),
        },
        {
          label: 'Twitter',
          link: faker.internet.url(),
        },
        {
          label: 'LinkedIn',
          link: faker.internet.url(),
        },
      ],
      avatar: faker.image.personPortrait(),
      meta_data: {
        gender: faker.person.sex(),
        dob: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }),
        theme_code: 'DEFAULT',
        is_super_admin: false,
      },
    };
    loggernaut.debug(dummyUser)
  }
}
