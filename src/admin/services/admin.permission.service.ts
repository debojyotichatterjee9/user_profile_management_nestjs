import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import {
  CreatePermissionBulkDto,
  CreatePermissionDto,
} from '../dto/request.dtos/create.permission.dto';
import { PaginationQueryParams } from '../dto/request.dtos/generic.pagination.list.dto';
import { PermissionListResponseDto } from '../dto/response.dtos/permission.list.response.dto';
import loggernaut from 'loggernaut';
import { UpdatePermissionDto } from '../dto/request.dtos/update.permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(payload: CreatePermissionDto): Promise<Permission> {
    try {
      const permission: Permission = this.permissionsRepository.create(payload);
      return await this.permissionsRepository.save(permission);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async bulkCreate(
    payload: CreatePermissionBulkDto,
  ): Promise<{ data: Permission[] }> {
    try {
      const permissionsList: Partial<Permission>[] = payload.permissions;
      const createdPermissions: Permission[] = [];

      for (const perm of permissionsList) {
        const permission: Permission = this.permissionsRepository.create(perm);
        const savedPermission: Permission =
          await this.permissionsRepository.save(permission);
        createdPermissions.push(savedPermission);
      }

      return { data: createdPermissions };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This function retrieves a list of permissions based on pagination query
   * parameters, including search criteria, page number, and limit.
   *
   * @param queryParams The `findAll` function you provided is an
   * asynchronous function that retrieves a list of permissions based on the
   * pagination query parameters passed to it. The function performs a database
   * query to fetch permissions with optional search criteria and pagination
   * settings.
   *
   * @return The function `findAll` returns a Promise that resolves to a
   * `PermissionListResponseDto` object. This object contains the following
   * properties:
   * - `totalCount`: Total count of permissions in the database.
   * - `filterCount`: Count of permissions after applying the pagination filters.
   * - `permissionList`: An array of permission objects that match the pagination
   * criteria.
   */
  async findAll(
    queryParams: PaginationQueryParams,
  ): Promise<PermissionListResponseDto> {
    try {
      const {
        search,
        page,
        limit,
      }: { search?: string; page?: any; limit?: any } = queryParams;
      const query =
        this.permissionsRepository.createQueryBuilder('permissions');
      if (search) {
        query.where('name ILIKE :search AND is_enabled = :enabled', {
          enabled: true,
          search: `%${search}%`,
        });
      } else {
        query.where('is_enabled = :enabled', {
          enabled: true,
        });
      }
      const totalCount: number = await this.permissionsRepository.count();

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
      let [data, filterCount] = filterResult;
      filterCount = search ? filterCount : data.length;
      return {
        totalCount,
        filterCount,
        permissionList: data,
      };
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  /**
   * Retrieves a single permission by its identifier.
   * @param id - The unique identifier of the permission to retrieve.
   * @returns A promise that resolves to the found Permission object, including its related roles.
   */
  async findOne(id: string): Promise<Permission> {
    try {
      const permissionInfo: Permission | null =
        await this.permissionsRepository.findOne({
          where: {
            id,
          },
        });
      if (!permissionInfo) {
        throw new NotFoundException('Permission not found!');
      }
      return permissionInfo;
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message, error.status);
    }
  }

  async update(id: string, payload: UpdatePermissionDto): Promise<Permission> {
    try {
      const permission: Permission | null =
        await this.permissionsRepository.findOne({
          where: { id },
        });

      if (!permission) {
        throw new NotFoundException('Permission not found!');
      }

      // Merge the existing permission with the new data
      const updatedPermission: Permission = this.permissionsRepository.merge(
        permission,
        payload,
      );

      // Save the updated organization back to the database
      return await this.permissionsRepository.save(updatedPermission);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<Permission> {
    try {
      const permission: Permission | null =
        await this.permissionsRepository.findOne({
          where: { id },
        });

      if (!permission) {
        throw new NotFoundException('Permission not found!');
      }

      // Update the permission for soft delete
      permission.is_enabled = false;
      // Save the updated permission back to the database
      return await this.permissionsRepository.save(permission);
    } catch (error) {
      loggernaut.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
