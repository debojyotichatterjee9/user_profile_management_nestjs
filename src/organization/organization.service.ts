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
  /**
   * The function creates a new organization using the provided data and saves it to the database,
   * handling any errors that may occur.
   *
   * @param CreateOrganizationDto createOrganizationDto The `createOrganizationDto` parameter in the
   * `create` function is an object of type `CreateOrganizationDto`. It is used to pass data necessary
   * for creating a new organization entity. This object likely contains properties such as name,
   * description, address, contact information, etc., depending on the requirements of
   *
   * @return The `create` method is returning the organization entity that is created and saved in the
   * database.
   */
  async create(payload: CreateOrganizationDto): Promise<Organization> {
    try {
      const organization = this.organizationRepository.create(payload);
      return await this.organizationRepository.save(organization);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This function retrieves a list of organizations based on pagination query parameters, including
   * search criteria, page number, and limit.
   *
   * @param PaginationQueryParams queryParams The `findAll` function you provided is an asynchronous
   * function that retrieves a list of organizations based on the provided `PaginationQueryParams`. The
   * `PaginationQueryParams` object likely contains information such as search keywords, page number,
   * and limit for pagination.
   *
   * @return The `findAll` function returns an object with the following properties:
   * - `totalCount`: Total count of organizations in the database
   * - `filterCount`: Count of organizations after applying the search and pagination filters
   * - `organizationList`: List of organizations that match the search criteria and pagination limits
   */
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
        query.where(
          'name ILIKE :search OR contact_email ILIKE :search AND is_deleted = :deleted',
          {
            deleted: false,
            search: `%${search}%`,
          },
        );
      } else {
        query.where('is_deleted = :deleted', {
          deleted: false,
        });
      }
      const totalCount = await this.organizationRepository.count();

      if (page > totalCount && limit > totalCount) {
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

  /**
   * This TypeScript function asynchronously finds an organization by its ID, including related
   * address, contact, and social profile information, handling exceptions appropriately.
   *
   * @param string id The `id` parameter in the `findOne` function is a string that represents the
   * unique identifier of the organization you want to retrieve information for. This identifier is
   * used to query the database and find the organization with the matching ID.
   *
   * @return The `findOne` method is returning the organization information with the specified `id`,
   * including its address, contact details, and social profiles. If the organization is not found, a
   * `NotFoundException` is thrown with the message 'Organization not found!'. If any other error
   * occurs during the process, a `BadRequestException` is thrown with the error message and status
   * code.
   */
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

  /**
   * This TypeScript function updates an organization in a database by merging existing data with new
   * data and saving the updated organization back to the database, handling exceptions appropriately.
   *
   * @param string id The `id` parameter in the `update` function is a string that represents the unique
   * identifier of the organization that needs to be updated. It is used to query the database for the
   * specific organization that needs to be updated.
   * @param UpdateOrganizationDto updateOrganizationDto The `updateOrganizationDto` parameter in the
   * `update` function is of type `UpdateOrganizationDto`. This parameter likely contains the data that
   * needs to be updated for the organization entity. When this function is called, it retrieves an
   * organization from the database based on the provided `id`, merges the existing
   *
   * @return The `update` method is returning the updated organization after merging the existing
   * organization with the new data and saving it back to the database.
   */
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

  /**
   * The `remove` function in TypeScript asynchronously soft deletes an organization by updating its
   * properties and saving the changes to the database, handling exceptions with appropriate logging and
   * error messages.
   *
   * @param string id The `remove` function you provided is an asynchronous function that soft deletes an
   * organization by setting the `is_deleted` flag to true and updating the `deleted_on` field with the
   * current date in the database.
   */
  async remove(id: string) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found!');
      }

      // Update the organization for soft delete
      organization.is_deleted = true;
      organization.deleted_on = new Date();

      // Save the updated organization back to the database
      return await this.organizationRepository.save(organization);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
