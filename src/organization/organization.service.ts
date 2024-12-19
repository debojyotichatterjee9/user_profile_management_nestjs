import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/request.dtos/create.organization.dto';
import { UpdateOrganizationDto } from './dto/request.dtos/update.organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryParams } from './dto/request.dtos/fetch.organization.list.dto';
import loggernaut from 'loggernaut';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}
  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const organization = this.organizationRepository.create(
        createOrganizationDto,
      );
      return await this.organizationRepository.save(organization);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(queryParams: PaginationQueryParams) {
    try {
      const {
        search,
        page,
        limit,
      }: { search?: string; page?: any; limit?: any } = queryParams;
      const query = this.organizationRepository
        .createQueryBuilder('organization')
        .leftJoinAndSelect('organization.address', 'address')
        .leftJoinAndSelect('organization.contact', 'contact')
        .leftJoinAndSelect('organization.social_profiles', 'social_profiles');
      if (search) {
        query.where('name ILIKE :search OR contact_email ILIKE :search', {
          search: `%${search}%`,
        });
      }
      const totalCount = await this.organizationRepository.count();

      if (page >= totalCount && limit > totalCount) {
        throw new NotFoundException(
          'The page number exceeds the maximum number of records.',
        );
      }

      const [filterResult] = await Promise.all([
        query
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount(),
      ]);
      const [data, filterCount] = filterResult;
      return {
        totalCount,
        filterCount,
        organizationList: data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const organizationInfo = await this.organizationRepository.findOne({
        relations: {
          address: true,
          contact: true,
          social_profiles: true,
        },
        where: {
          id,
        },
      });
      if (!organizationInfo) {
        throw new NotFoundException('Organization not found!');
      }
      return organizationInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found!');
      }

      // Merge the existing organization with the new data
      const updatedOrganization = this.organizationRepository.merge(
        organization,
        updateOrganizationDto,
      );

      // Save the updated organization back to the database
      return await this.organizationRepository.save(updatedOrganization);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('User not found!');
      }

      // Update the organization for soft delete
      organization.is_deleted = true;
      organization.deleted_on = new Date();

      // Save the updated organization back to the database
      await this.organizationRepository.save(organization);
      loggernaut.info(`Organization with ID ${id} has been soft deleted.`);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
