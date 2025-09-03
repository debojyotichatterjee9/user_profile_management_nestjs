import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomDataProvider {
  constructor() {}

  generaterandomDummyUserData() {
    const randomDummyUser = {
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
          zipcode: faker.location.zipCode('#####'),
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
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
          zipcode: faker.location.zipCode('#####'),
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
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
      avatar: faker.image.personPortrait({ size: 128 }),
      meta_data: {
        gender: faker.person.sex(),
        dob: faker.date
          .birthdate({ mode: 'age', min: 18, max: 65 })
          .toDateString(),
        theme_code: 'DEFAULT',
        is_super_admin: false,
      },
    };
    return randomDummyUser;
  }

  generaterandomDummyOrganizationData() {
    const randomDummyOrganization = {
      name: faker.company.name(),
      contact_email: faker.internet.exampleEmail(),
      address: [
        {
          type: 'PRIMARY',
          label: 'Main Office',
          address: faker.location.streetAddress({ useFullAddress: true }),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          country_code: faker.location.countryCode('alpha-2'),
          zipcode: faker.location.zipCode('#####'),
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
          offset: '+9:30',
          zone: faker.location.timeZone(),
          is_default: true,
        },
        {
          type: 'SECONDARY',
          label: 'Delivery Centre',
          address: faker.location.streetAddress({ useFullAddress: true }),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          country_code: faker.location.countryCode('alpha-2'),
          zipcode: faker.location.zipCode('#####'),
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
          offset: '+9:30',
          zone: faker.location.timeZone(),
          is_default: false,
        },
      ],
      contact: [
        {
          type: 'PRIMARY',
          label: 'Main Office',
          country_code: `+${faker.location.countryCode('numeric')}`,
          number: faker.phone.number({ style: 'national' }),
          is_default: true,
        },
        {
          type: 'SECONDARY',
          label: 'Delivery Centre',
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
      logo: faker.image.urlPicsumPhotos({ height: 128, width: 128 }),
      meta_data: {
        is_super_org: false,
      },
    };
    return randomDummyOrganization;
  }
}
